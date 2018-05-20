const BaseRoute = require('./base');
const MenuModel = require('../models/menu');
const ProductModel = require('../models/product');

const authenticate = require('../middleware/authenticate');
const addCreator = require('../middleware/add-creator');
const idParser = require('../middleware/id-parser');



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
		this._router.post(this.PATH, authenticate, addCreator, this._onCreate.bind(this));
		this._router.get(this.PATH, authenticate, addCreator, this._onRead.bind(this));
		this._router.get(`${this.PATH}/:id`, authenticate, addCreator, idParser, this._onGetByIds.bind(this));
		this._router.delete(`${this.PATH}/:id`, authenticate, addCreator, idParser, this._onDelete.bind(this));
	}
}

module.exports = MenuRoute;
