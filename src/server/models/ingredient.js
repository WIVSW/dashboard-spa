const mongoose = require('mongoose');

const { Schema } = mongoose;

const IngredientSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	},
	group: {
		required: true,
		type: Schema.Types.ObjectId,
		ref: 'IngredientsGroup'
	},
	supplier: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	},
	parameters: {
		type: Object,
		required: true
	},
	primecost: {
		type: Number,
		required: true
	},
	_creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

IngredientSchema.methods.toJSON = function() {
	const {_id, name, group, supplier, parameters, primecost} = this.toObject();

	return {_id, name, group, supplier, parameters, primecost};
};

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
