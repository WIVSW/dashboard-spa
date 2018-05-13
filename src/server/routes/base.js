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

    generateResponse(res, promise) {
        return promise
            .then(
                (data) => res
                    .status(200)
                    .send(data)
            )
            .catch(
                (err) => res
                    .status(400)
                    .send(err)
            );
    }

    read() {
        return this.MODEL.find();
    }

    _setupRoute() {}
}

module.exports = BaseRoute;
