const BaseRoute = require('./base');
const MenuModel = require('../models/menu');
const ProductModel = require('../models/product');



class ProductRoute extends BaseRoute {
	constructor(deps) {
		const path = '/products';
		const { router } = deps;
		const model = ProductModel;

		super({path, router, model});
	}

	_setupRoute() {
		super._setupRoute();
	}
}

module.exports = ProductRoute;
