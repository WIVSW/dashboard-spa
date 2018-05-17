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

    create(data) {
        const user = new this.MODEL(data);
        let model;
        return user
            .save()
            .then((doc) => {
                model = doc;
                return user.generateAuthToken()
            })
            .then(() => model)
            .catch((err) => {
                return Promise.reject(this.getResponseObject([], 400, err.message));
            });
    }
}

module.exports = UserRoute;
