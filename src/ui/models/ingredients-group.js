import Model from './base';



class IngredientsGroup extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.name = data['name'];
		this.ingredients = data['ingredients'];
	}
}

export default IngredientsGroup;