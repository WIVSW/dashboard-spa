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
		this._router.post(`${this.PATH}/login`, this._onLogin.bind(this));
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

	_onLogin(req, res) {
		const {email, password} = req.body;

		if (!email || !password)
			return res
				.status(400)
				.send({message: 'Bad Request', data: []});

		return UserModel
			.findByCredentials(email, password)
			.then(
				(user) => user
					.generateAuthToken()
					.then(
						(token) => res
							.header('x-auth', token)
							.status(200)
							.send({ message: 'OK', data: user })
					)
			)
			.catch(() => res
				.status(400)
				.send({message: 'Invalid data', data: []})
			);
	}
}

module.exports = UserRoute;
