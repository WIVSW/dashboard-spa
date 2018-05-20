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
		this._router.delete(`${this.PATH}/me/token`, authenticate, this._onDeleteToken.bind(this));
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

	_onDeleteToken(req, res) {
		return req.user
			.removeToken(req.token)
			.then(
				() => this.generateResponse(res, this.getResponseObject([], 200, 'OK')),
				() => this.generateResponse(res, this.getResponseObject([], 400, 'Bad request'))
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
			return this.generateResponse(
				res,
				this.getResponseObject([], 400, 'Bad request')
			);

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
			.catch(() => this.generateResponse(
					res,
					this.getResponseObject([], 400, 'Invalid data')
				)
			);
	}
}

module.exports = UserRoute;
