class BaseRouter {
    constructor(deps) {
        this.PATH = deps.path;
        this.MODEL = deps.model;

        this._router = deps.router;

        this._setupRoute();
    }

    create(req, res, data) {
        const model = new this.MODEL(data);
        return model.save()
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

    _setupRoute() {}
}

module.exports = BaseRouter;
