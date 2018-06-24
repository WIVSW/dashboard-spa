import Model from './base';



class Product extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.name = data['name'];
		this.ingredients = data['ingredients'];
		this.price = data['price'];
	}
}

export default Product;