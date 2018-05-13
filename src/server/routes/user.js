const BaseRoute = require('./base');
const UserModel = require('../models/user');



class UserRoute extends BaseRoute {
    constructor(deps) {
        const path = '/users';
        const { router } = deps;
        const model = UserModel;

        super({path, router, model});
    }

    create(req, res) {
        arguments[2] = req.body;

        return super.create(...arguments);
    }

    _setupRoute() {
        this._router.get(this.PATH, (req, res) => {
            res.send('User');
        });

        this._router.post(this.PATH, this.create.bind(this));
    }
}

module.exports = UserRoute;
