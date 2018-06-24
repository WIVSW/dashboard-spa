import Network from './network';

import Ingredient from './api/ingredient';
import IngredientsGroup from './api/ingredients-group';
import Menu from './api/menu';
import Product from './api/product';
import User from './api/user';



class Application {
	constructor() {
		this._network = new Network();

		this.api = {};

		this._bindApis();
	}

	_bindApis() {
		const { api } = this;
		const apiDeps = {
			network: this._network
		};

		api.ingredient = new Ingredient(apiDeps);

		api.ingredientsGroup = new IngredientsGroup(apiDeps);

		api.menu = new Menu(apiDeps);

		api.product = new Product(apiDeps);

		api.user = new User(apiDeps);
	}

}

export default Application;