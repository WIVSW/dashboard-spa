import Network from './network';

import Ingredient from './api/ingredient';
import IngredientsGroup from './api/ingredients-group';
import Menu from './api/menu';
import Product from './api/product';
import User from './api/user';

import Parser from './services/parser';
import ProductCalculator from './services/product-calculator';



class Application {
	constructor() {
		this._network = new Network();

		this.api = {};
		this.services = {};

		this._bindApis();
		this._bindServices();
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

	_bindServices() {
		const { services } = this;

		services.parser = new Parser();
		
		services.productCalculator = new ProductCalculator({
			productApi: this.api.product,
			ingredientApi: this.api.ingredient
		});
	}

}

export default Application;