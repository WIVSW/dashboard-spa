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
		if (group[0].ingredients.indexOf(id) !== -1)
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
				return super._createOne(data);
			})
			.then((doc) => {
				model = doc;
				return this._addIgredientToGroup(doc._id, group)
			})
			.then(() => model)
			.catch(() => null)
	}

	_deleteIgredientFromGroup(ingredient) {
		const _id = ingredient.group;
		const { _creator } = ingredient;

		return IngredientsGroupModel
			.findOne({ _id, _creator })
			.then((doc) => {
				const _id = { ingredient };
				const ingredients = doc.ingredients;
				const i = ingredients.indexOf(_id);

				if (i === -1)
					return Promise.resolve();

				ingredients.splice(i,1);

				return IngredientsGroupModel.findByIdAndUpdate(doc._id, { $set: { ingredients} }, { new: true });
			})
			.then(() => ingredient);
	}

	_deleteOne(_id, _creator) {
		return super
			._deleteOne(_id, _creator)
			.then((ingredient) => this._deleteIgredientFromGroup(ingredient))
			.catch((err) => Promise.reject(err));
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

	_updateOne(_id, body) {
		return this
			._hasAccessToGroup(body[_id].group, body._creator)
			.then(() => super._updateOne(body))
			.catch(() => null)
	}
}

module.exports = IngredientRoute;