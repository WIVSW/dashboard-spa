const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
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
    price: {
        type: Number,
        required: true
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
