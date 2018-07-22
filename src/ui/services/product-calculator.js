class ProductCalculator {
	constructor(deps) {
		this.VAR_KEY = '$';
		this.PRODUCT_KEY = 'product__';
		this.INGREDIENT_KEY = 'ingredient__';
		
		this._productApi = deps.productApi;
		this._ingredientApi = deps.ingredientApi;
	}
	
	getProductKey(value) {
		return `${this.VAR_KEY}${this.PRODUCT_KEY}${value}`
	}
	
	getIngredientKey(value) {
		return `${this.VAR_KEY}${this.INGREDIENT_KEY}${value}`
	}
	
	getProductTotalById(id) {
		return this._productApi
			.getByIds([ id ])
			.then((data) => {
				if (!data || !data.length)
					return Promise.reject();
				
				const product = data[0];
				const ids = product.ingredients.map(item => item.id);
				
				return this._ingredientApi
					.getByIds(ids)
					.then((data) => {
						const source = product.ingredients;
						product.ingredients = data.map((item) => {
							const ingredient = source.find((i) => i.id === item._id);
							item.count = parseFloat(ingredient.count);
							return item;
						});
						
						return this._calcTotal(product);
					})
			});
	}
	
	_calcTotal(product) {
		let { ingredients } = product;
		
		product.primecost = this._getPrimeCostFromIngredients(ingredients);
		product.profit = this._parseNumber(product.price) - this._parseNumber(product.primecost);
		product.parameters = this._getParametersFromIngredients(ingredients);
		product = this._bindParameters(product);
		product = this._convertNumbersToStrings(product);
		product = this._removeExtras(product);
		
		ingredients = ingredients.map((ingredient) => this._bindParameters(ingredient));
		ingredients = ingredients.map((ingredient) => this._convertStringsToNumbers(ingredient));
		ingredients = ingredients.map((ingredient) => this._convertNumbersToStrings(ingredient));
		ingredients = ingredients.map((ingredient) => this._removeExtras(ingredient));
		
		return { product, ingredients };
	}
	
	_getPrimeCostFromIngredients(ingredients) {
		return ingredients.reduce((prev, curr) => {
			return prev +
				(
					this._parseNumber(curr.primecost) *
					this._parseNumber(curr.count)
				);
		}, 0);
	}
	
	_getParametersFromIngredients(ingredients) {
		const keys = Object.keys(ingredients[0].parameters);
		const parameters = {};
		
		keys.forEach((key) => {
			parameters[key] = ingredients.reduce((prev, curr) => {
				let value = this._parseNumber(curr.parameters[key]);
				value = value ? value * this._parseNumber(curr.count) : 0;
				
				return prev + value;
			}, 0);
		});
		
		return parameters;
	}
	
	_bindParameters(source) {
		Object
			.keys(source.parameters)
			.forEach((key) => source[key] = source.parameters[key]);
		
		return source;
	}
	
	_removeExtras(source) {
		const exludes = [
			'_id',
			'_id_integer',
			'_id_decimal',
			'ingredients',
			'parameters',
			'group',
			'group_integer',
			'group_decimal'
		];
		
		exludes.forEach((key) => {
			if (source[key])
				delete source[key];
		});
		
		return source;
	}
	
	_convertStringsToNumbers(source) {
		for(let key in source) {
			if (typeof source[key] === 'string') {
				const number = this._parseNumber(source[key]);
				source[key] = number ? number : source[key];
			}
		}
		
		return source;
	}
	
	_convertNumbersToStrings(product) {
		const exludes = [
			'count'
		];

		for(let key in product) {
			if (typeof product[key] === 'number' && !exludes.includes(key)) {
				const value = product[key];
				const isNegative = value < 0;
				const str = Math.abs(value / 1).toFixed(2);
				const integer = `${ isNegative ? '-' : '' }${str.replace(/\.\d{0,}/, '')}`;
				const decimal = str.replace(/\d{0,}\./, '');
				
				product[`${key}_integer`] = integer;
				product[`${key}_decimal`] = decimal;
				
				delete product[key];
			}
		}

		return product;
	}
	
	_parseNumber(str) {
		if (typeof str === 'number' && !Number.isNaN(str))
			return str;
		
		if (str.includes(',')) {
			str = str
				.match(/\d{1,},{1,}\d{1,}/g)[0]
				.replace(',', '.');
		}
		
		return parseFloat(str);
	}
}

export default ProductCalculator;
