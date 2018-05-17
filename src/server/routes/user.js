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
        super._setupRoute();
    }

    _onCreate(req, res) {
        let user;
        return this
            .create(req.body)
            .then((data) => {
                user = data;
                return user.generateAuthToken();
            })
            .then((token) => {
                return res
                    .header('x-auth', token)
                    .status(200)
                    .send({message: 'OK', data: user});
            })
            .catch(
                (err) =>
                    this.generateResponse(
                        res,
                        this.getResponseObject([], 400, err.message)
                    )
            );
    }
}

module.exports = UserRoute;
