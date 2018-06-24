import Model from './base';



class Ingredient extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.name = data['name'];
		this.group = data['group'];
		this.supplier = data['supplier'];
		this.parameters = data['parameters'];
		this.primecost = data['primecost'];
	}
}

export default Ingredient;