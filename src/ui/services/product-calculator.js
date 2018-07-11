class ProductCalculator {
	constructor(deps) {
		this._productApi = deps.productApi;
		this._ingredientApi = deps.ingredientApi;
	}
	
	getProductTotalById(id) {
		console.log(id);
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
							item.count = ingredient.count;
							return item;
						});
						
						return this._calcTotal(product);
					})
			});
	}
	
	_calcTotal(product) {
		console.log(product);
	}
}

export default ProductCalculator;
