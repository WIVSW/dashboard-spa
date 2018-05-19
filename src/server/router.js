const bodyParser = require('body-parser');

const Public = require('./routes/public');
const User = require('./routes/user');
const Ingredient = require('./routes/ingredient');
const IngredientsGroup = require('./routes/ingredients-group');



class Router {
	constructor(deps) {
		this._app = deps.app;
		this._router = deps.router;

		this._routes = [];

		this._declareRoutes();
		this._bindRoutes();
	}

	_addRoute(route) {
		this._routes.push(new route({ router: this._router }));
	}

	_bindRoutes() {
		this._app.use(bodyParser.json());

		this._routes.forEach(route => this._app.use(route.PATH, this._router))
	}

	_declareRoutes() {
		[
			Public,
			User,
			Ingredient,
			IngredientsGroup
		].forEach((model) => this._addRoute(model));
	}
}

module.exports = Router;
