import Model from './base';



class Product extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.name = data['name'];
		this.ingredients = this._parseIngredients(data['ingredients']);
		this.price = data['price'];
	}
	
	_parseIngredients(ingredients) {
		return ingredients.map((ingredient) => ({
			id: ingredient.id,
			count: ingredient.count
		}));
	}
}

export default Product;