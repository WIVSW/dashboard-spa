import Model from './base';



class Menu extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.name = data['name'];
		this.products = data['products'];
	}
}

export default Menu;