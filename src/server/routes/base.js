const { ObjectID } = require('mongodb');



class BaseRoute {
    constructor(deps) {
        this.PATH = deps.path;
        this.MODEL = deps.model;

        this._router = deps.router;

        this._setupRoute();
    }

    create(data) {
        const model = new this.MODEL(data);
        return model.save();
    }

    delete(idStr) {
        return this._doForEachId(idStr, this._deleteOne.bind(this));
    }

    getByIds(idStr) {
        return this._doForEachId(idStr, this._getById.bind(this));
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

    read() {
        return this.MODEL.find();
    }

    _deleteOne(id) {
        return this.MODEL.findByIdAndRemove(id);
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
        promise = promise
            .then((user) => this.getResponseObject(user));

        return this.generateResponse(res, promise);
    }

    _setupRoute() {}

    _getById(id) {
        return this.MODEL.findById(id);
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
}

module.exports = BaseRoute;
