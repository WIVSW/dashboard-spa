const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./routes/user');
const Ingredient = require('./routes/ingredient');
const IngredientsGroup = require('./routes/ingredients-group');
const Menu = require('./routes/menu');
const Product = require('./routes/product');



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

		this._app.use(express.static(path.resolve(__dirname, '../public')));
		this._app.use(`/api`, this._router);
		this._routes.forEach(route => this._app.use(`/api${route.PATH}`, this._router));
		this._app.use((req, res) => res.sendFile(path.resolve(__dirname, '../public/index.html')));
	}

	_declareRoutes() {
		[
			User,
			Ingredient,
			IngredientsGroup,
			Menu,
			Product
		].forEach((model) => this._addRoute(model));
	}
}

module.exports = Router;
