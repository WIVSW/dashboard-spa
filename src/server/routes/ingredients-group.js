const BaseRoute = require('./base');
const IngredientsGroupModel = require('../models/ingredients-group');



class IngredientRoute extends BaseRoute {
	constructor(deps) {
		const path = '/ingredients';
		const { router } = deps;
		const model = IngredientsGroupModel;

		super({path, router, model});
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = IngredientRoute;