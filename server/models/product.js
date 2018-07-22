const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	},
	ingredients: {
		type: Array,
		default: [],
		value: {
			type: Object,
			value: {
				id: {
					type: Schema.Types.ObjectId,
					ref: 'Ingredient'
				},
				count: {
					type: Number,
					default: 1,
					validate: {
						validator: (number) => {
							return number > 0 && number % 1 === 0;
						},
						message: '{VALUE} should be more then 0 and integer!'
					}
				}
			}
		}
	},
	price: {
		type: Number,
		default: 0
	},
	_creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

ProductSchema.methods.toJSON = function() {
	const {_id, name, ingredients, price} = this.toObject();

	return {_id, name, ingredients, price};
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
