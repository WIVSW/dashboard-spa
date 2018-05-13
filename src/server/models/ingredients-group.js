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
    }]
});

const IngredientsGroup = mongoose.model('IngredientsGroup', IngredientsGroupSchema);

module.exports = IngredientsGroup;
