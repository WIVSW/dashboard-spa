const BaseRoute = require('./base');
const UserModel = require('../models/user');
const authenticate = require('../middleware/authenticate');



class UserRoute extends BaseRoute {
	constructor(deps) {
		const path = '/users';
		const { router } = deps;
		const model = UserModel;

		super({path, router, model});
	}

	create(data) {
		const model = new this.MODEL(data);
		return model.save();
	}

	_setupRoute() {
		this._router.post(this.PATH, this._onCreate.bind(this));
		this._router.get(`${this.PATH}/me`, authenticate, this._onGetSelf.bind(this));
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

	_onGetSelf(req, res) {
		return res
			.status(200)
			.send({ message: 'OK', data: req.user });
	}
}

module.exports = UserRoute;
