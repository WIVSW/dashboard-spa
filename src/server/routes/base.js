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

    getByIds(idStr) {
        const ids = idStr.split(',');
        const promises = ids.map((id) => this._getById(id));

        return Promise
            .all(promises)
            .then((data) => {
                return data.filter(data => !!data);
            })
    }

    generateResponse(res, promise) {
        return promise
            .then(
                (data) =>
                    res
                        .status(200)
                        .send(data)
            )
            .catch(
                (err) =>
                    res
                        .status(400)
                        .send(err)
            );
    }

    read() {
        return this.MODEL.find();
    }

    _setupRoute() {}

    _getById(id) {
        if (!ObjectID.isValid(id)) {
            return Promise.reject(`ID "${id}" is not valid`);
        }

        return this.MODEL.findById(id);
    }
}

module.exports = BaseRoute;
