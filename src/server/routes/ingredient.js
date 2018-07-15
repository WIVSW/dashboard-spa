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
	
	create(body) {
		const updateObj = {};
		let dataToResolve;
		return super
			.create(body)
			.then((doc) => {
				dataToResolve = doc;
				doc.forEach((ingredient) => {
					if (!Array.isArray(updateObj[ingredient.group]))
						updateObj[ingredient.group] = [];
					
					updateObj[ingredient.group].push(ingredient._id);
					
				});
				
				const promises = Object
					.keys(updateObj)
					.map((groupId) => IngredientsGroupModel.findById(groupId));
				
				return Promise.all(promises);
			})
			.then((groups) => {
				const promises = Object
					.keys(updateObj)
					.map((id) => {
						const onlyUnique = (val, i, arr) => arr.indexOf(val) === i;
						const foundGroup = groups.find((group) => String(group._id) === String(id));
						const ingredients = foundGroup.ingredients
							.concat(updateObj[id])
							.filter(onlyUnique);

						return IngredientsGroupModel.findByIdAndUpdate(id, { $set: { ingredients} }, { new: true });
					});
				return Promise.all(promises);
			})
			.then(() => dataToResolve);
	}

	_createOne(data) {
		return this
			._hasAccessToGroup(data.group, data._creator)
			.then((doc) => super._createOne(data))
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
			.then(() => super._updateOne(_id, body))
	}
}

module.exports = IngredientRoute;