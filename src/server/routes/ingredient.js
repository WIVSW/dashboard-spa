const BaseRoute = require('./base');
const IngredientModel = require('../models/ingredient');



class IngredientRoute extends BaseRoute {
	constructor(deps) {
		const path = '/ingredients';
		const { router } = deps;
		const model = IngredientModel;

		super({path, router, model});
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = IngredientRoute;