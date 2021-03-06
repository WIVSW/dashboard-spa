const BaseRoute = require('./base');
const IngredientsGroupModel = require('../models/ingredients-group');
const IngredientModel = require('../models/ingredient');

const authenticate = require('../middleware/authenticate');
const addCreator = require('../middleware/add-creator');
const idParser = require('../middleware/id-parser');


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