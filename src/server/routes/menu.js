const BaseRoute = require('./base');
const MenuModel = require('../models/menu');
const ProductModel = require('../models/product');



class MenuRoute extends BaseRoute {
	constructor(deps) {
		const path = '/menus';
		const { router } = deps;
		const model = MenuModel;

		super({path, router, model});
	}

	_deleteOne(_id, _creator) {
		return super
			._deleteOne(_id, _creator)
			.then((menu) => {
				const { products } = menu;

				const promises = products.map((_id) => ProductModel.findOneAndRemove({ _id, _creator }));

				return Promise
					.all(promises)
					.then(() => menu);
			})
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = MenuRoute;
