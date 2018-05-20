const mongoose = require('mongoose');

const { Schema } = mongoose;

const MenuSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	},
	products: {
		type: Array,
		default: [],
		value: {
			type: Schema.Types.ObjectId,
			ref: 'Product'
		}
	},
	_creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

MenuSchema.methods.toJSON = function() {
	const {_id, name, products} = this.toObject();

	return {_id, name, products};
};

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
