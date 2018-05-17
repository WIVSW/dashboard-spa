const mongoose = require('mongoose');

const { Schema } = mongoose;

const IngredientsGroupSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	},
	ingredients: [{
		type: Schema.Types.ObjectId,
		ref: 'Ingredient'
	}],
	_creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

IngredientsGroupSchema.methods.toJSON = function() {
	const {_id, name, ingredients} = this.toObject();

	return {_id, name, ingredients};
};

const IngredientsGroup = mongoose.model('IngredientsGroup', IngredientsGroupSchema);

module.exports = IngredientsGroup;
