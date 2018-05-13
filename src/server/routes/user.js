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
        this._router.get(this.PATH, (req, res) => {
            res.send('User');
        });
    }
}

module.exports = UserRoute;
