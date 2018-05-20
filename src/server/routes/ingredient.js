const BaseRoute = require('./base');
const IngredientModel = require('../models/ingredient');
const IngredientsGroupModel = require('../models/ingredients-group');



class IngredientRoute extends BaseRoute {
	constructor(deps) {
		const path = '/ingredients';
		const { router } = deps;
		const model = IngredientModel;

		super({path, router, model});
	}

	_addIgredientToGroup(id, group) {
		if (group[0].ingredients.indexOf(id) === -1)
			return Promise.resolve();

		group[0].ingredients.push(id);
		const { ingredients } = group[0];
		return IngredientsGroupModel.findByIdAndUpdate(group[0].id, { $set: { ingredients} }, { new: true });
	}

	_createOne(data) {
		let group, model;
		return this
			._hasAccessToGroup(data.group, data._creator)
			.then((doc) => {
				group = doc;
				return super
					._createOne(data)
					.then((doc) => {
						model = doc;
						return doc;
					})
			})
			.then((doc) => this._addIgredientToGroup(doc._id, group))
			.then(() => model)
			.catch(() => null)
	}

	_hasAccessToGroup(_id, _creator) {
		// reject if no access
		return IngredientsGroupModel
			.find({ _id, _creator})
			.then((data) => {
				if (!data || !data.length)
					return Promise.reject();
				return data;
			})
			.catch(() => {
				const err = this.getResponseObject([], 403, undefined, false);
				return Promise.reject(err);
			});
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = IngredientRoute;