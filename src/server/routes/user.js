const BaseRoute = require('./base');
const UserModel = require('../models/user');



class UserRoute extends BaseRoute {
    constructor(deps) {
        const path = '/users';
        const { router } = deps;
        const model = UserModel;

        super({path, router, model});
    }

    _setupRoute() {
        this._router.post(this.PATH, this._onCreate.bind(this));
        this._router.get(this.PATH, this._onRead.bind(this));
        this._router.get(`${this.PATH}/:id`, this._onGetByIds.bind(this));
        this._router.delete(`${this.PATH}/:id`, this._onDelete.bind(this));
    }
}

module.exports = UserRoute;
