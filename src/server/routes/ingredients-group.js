const BaseRoute = require('./base');
const IngredientsGroupModel = require('../models/ingredients-group');
const IngredientModel = require('../models/ingredient');



class IngredientsGroupRoute extends BaseRoute {
	constructor(deps) {
		const path = '/ingredients-groups';
		const { router } = deps;
		const model = IngredientsGroupModel;

		super({path, router, model});
	}

	_deleteOne(_id, _creator) {
		return super
			._deleteOne(_id, _creator)
			.then((group) => {
				const { ingredients } = group;

				const promises = ingredients.map((_id) => IngredientModel.findOneAndRemove({ _id, _creator }));

				return Promise
					.all(promises)
					.then(() => group);
			})
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = IngredientsGroupRoute;