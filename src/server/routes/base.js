const idParser = require('../middleware/id-parser');
const authenticate = require('../middleware/authenticate');
const addCreator = require('../middleware/add-creator');



class BaseRoute {
	constructor(deps) {
		this.PATH = deps.path;
		this.MODEL = deps.model;

		this._router = deps.router;

		this._setupRoute();
	}

	getByIds(ids, _creator) {
		return this._doForEachId(ids, (id) => this._getById(id, _creator));
	}

	create(body) {
		const promises = body.map((data) => this._createOne(data));
		return Promise
			.all(promises)
			.then((models) => {
				const valid = models.filter((model) => !!model);
				if (!valid.length) {
					return Promise.reject();
				}
				return valid;
			})
			.catch((err) => {
				return Promise.reject(this.getResponseObject([], 400, err.message));
			});
	}

	delete(ids) {
		return this._doForEachId(ids, this._deleteOne.bind(this));
	}

	read(body) {
		const { _creator } = body;
		return this.MODEL.find({ _creator });
	}

	update(ids, body) {
		return this._doForEachId(ids, (id) => this._updateOne(id, body));
	}

	generateResponse(res, obj) {
		const { code, message, data } = obj;

		return res
			.status(code)
			.send({ message, data });
	}

	getResponseObject(data, code, message, isSuccess) {
		if (isSuccess === true) {
			if (!code) code = 200;
			if (!message) message = 'OK';
		} else if (isSuccess === false) {
			if (!code) code = 400;
			if (!message) message = 'Bad request';
		}
		return {code, message, data};
	}

	_createOne(data) {
		const model = new this.MODEL(data);
		return model
			.save()
			.catch(() => null);
	}

	_getById(_id, _creator) {
		return this.MODEL.findOne({ _id, _creator });
	}

	_deleteOne(id) {
		return this.MODEL.findByIdAndRemove(id);
	}

	_updateOne(id, body) {
		return this.MODEL.findByIdAndUpdate(id, { $set: body[id] }, { new: true });
	}

	_doForEachId(ids, fn) {
		const promises = ids.map((id) => fn(id));

		return Promise
			.all(promises)
			.then((data) => {
				const valid = data.filter(data => !!data);

				if (!valid.length)
					return Promise.reject(this.getResponseObject([], 404, 'Not Found'));

				return valid;
			})
	}

	_handleRequest(res, promise) {
		return promise
			.then(
				(data) => this.getResponseObject(data, undefined, undefined, true),
				(err) => this.getResponseObject(err.data, err.code, err.message, false)
			)
			.then((data) => this.generateResponse(res, data));
	}

	_setupRoute() {
		this._router.post(this.PATH, authenticate, addCreator, this._onCreate.bind(this));
		this._router.get(this.PATH, authenticate, addCreator, this._onRead.bind(this));
		this._router.get(`${this.PATH}/:id`, authenticate, addCreator, idParser, this._onGetByIds.bind(this));
		this._router.delete(`${this.PATH}/:id`, authenticate, addCreator, idParser, this._onDelete.bind(this));
		this._router.patch(`${this.PATH}/:id`, authenticate, addCreator, idParser, this._onUpdate.bind(this));
	}

	_onCreate(req, res) {
		return this._handleRequest(res, this.create(req.body));
	}

	_onDelete(req, res) {
		return this._handleRequest(res, this.delete(req.params.id));
	}

	_onGetByIds(req, res) {
		return this._handleRequest(res, this.getByIds(req.params.id, req.body._creator));
	}

	_onRead(req, res) {
		return this._handleRequest(res, this.read(req.body));
	}

	_onUpdate(req, res) {
		return this._handleRequest(res, this.update(req.params.id, req.body));
	}
}

module.exports = BaseRoute;
