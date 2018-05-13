const BaseRoute = require('./base');
const UserModel = require('../models/user');



class UserRoute extends BaseRoute {
    constructor(deps) {
        const path = '/users';
        const { router } = deps;
        const model = UserModel;

        super({path, router, model});
    }

    _create(req, res) {
        return this.generateResponse(res, this.create(req.body));
    }

    _getByIds(req, res) {
        const promise = this
            .getByIds(req.params.id)
            .then((users) => {
                if (!users.length) {
                    res
                        .status(404)
                        .send({users});
                    return Promise.reject(404);
                }

                return { users };
            });
        return this.generateResponse(res, promise);
    }

    _read(req, res) {
        const promise = this
            .read()
            .then((users) => { return { users } });

        return this.generateResponse(res, promise);
    }

    _setupRoute() {
        this._router.post(this.PATH, this._create.bind(this));
        this._router.get(this.PATH, this._read.bind(this));
        this._router.get(`${this.PATH}/:id`, this._getByIds.bind(this))
    }
}

module.exports = UserRoute;
