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
        return model.save();
    }

    delete(idStr) {
        return this._doForEachId(idStr, this._deleteOne.bind(this));
    }

    read() {
        return this.MODEL.find();
    }

    update() {
        return this._doForEachId(idStr, this._updateOne.bind(this));
    }

    generateResponse(res, promise) {
        return promise
            .then(
                (obj) => {
                    let [ code, message, data ] = [ 200, 'OK',  {}];

                    if (obj.code) code = obj.code;
                    if (obj.message) message = obj.message;
                    if (obj.data) data = obj.data;

                    return res
                        .status(code)
                        .send({ message, data });
                }
            )
            .catch(
                (err) => {
                    let [ code, message, data ] = [ 400, 'Bad request',  {}];

                    if (err.code) code = err.code;
                    if (err.message) message = err.message;
                    if (err.data) data = err.data;

                    return res
                        .status(code)
                        .send({ message, data })
                }
            );
    }

    getResponseObject(data, code, message) {
        return {code, message, data};
    }

    _getById(id) {
        return this.MODEL.findById(id);
    }

    _deleteOne(id) {
        return this.MODEL.findByIdAndRemove(id);
    }

    _updateOne(id) {}

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
        promise = promise
            .then((user) => this.getResponseObject(user));

        return this.generateResponse(res, promise);
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
        return this._handleRequest(res, this.update(req.params.id));
    }
}

module.exports = BaseRoute;
