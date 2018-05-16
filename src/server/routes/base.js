const { ObjectID } = require('mongodb');



class BaseRoute {
    constructor(deps) {
        this.PATH = deps.path;
        this.MODEL = deps.model;

        this._router = deps.router;

        this._setupRoute();
    }

    getByIds(idStr) {
        return this._doForEachId(idStr, this._getById.bind(this));
    }

    create(data) {
        const model = new this.MODEL(data);
        return model
            .save()
            .catch((err) => {
                return Promise.reject(this.getResponseObject([], 400, err.message));
            });
    }

    delete(idStr) {
        return this._doForEachId(idStr, this._deleteOne.bind(this));
    }

    read() {
        return this.MODEL.find();
    }

    update(idStr, body) {
        return this._doForEachId(idStr, (id) => this._updateOne(id, body));
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

    _getById(id) {
        return this.MODEL.findById(id);
    }

    _deleteOne(id) {
        return this.MODEL.findByIdAndRemove(id);
    }

    _updateOne(id, body) {
        return this.MODEL.findByIdAndUpdate(id, { $set: body[id] }, { new: true });
    }

    _doForEachId(idStr, fn) {
        const ids = idStr.split(',');
        const promises = ids.map((id) => {
            if (!ObjectID.isValid(id)) {
                return Promise.resolve();
            }
            return fn(id);
        });

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
        this._router.post(this.PATH, this._onCreate.bind(this));
        this._router.get(this.PATH, this._onRead.bind(this));
        this._router.get(`${this.PATH}/:id`, this._onGetByIds.bind(this));
        this._router.delete(`${this.PATH}/:id`, this._onDelete.bind(this));
        this._router.patch(`${this.PATH}/:id`, this._onUpdate.bind(this));
    }

    _onCreate(req, res) {
        return this._handleRequest(res, this.create(req.body));
    }

    _onDelete(req, res) {
        return this._handleRequest(res, this.delete(req.params.id));
    }

    _onGetByIds(req, res) {
        return this._handleRequest(res, this.getByIds(req.params.id));
    }

    _onRead(req, res) {
        return this._handleRequest(res, this.read());
    }

    _onUpdate(req, res) {
        return this._handleRequest(res, this.update(req.params.id, req.body));
    }
}

module.exports = BaseRoute;
