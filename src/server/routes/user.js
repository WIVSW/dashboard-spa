const UserModel = require('../models/user');



class UserRoute {
    constructor(deps) {
        this.PATH = '/users';

        this._router = deps.router;
        this._model = UserModel;

        this._setupRoute();
    }

    _setupRoute() {
        this._router.get(this.PATH, (req, res) => {
            res.send('User');
        });
    }
}

module.exports = UserRoute;
