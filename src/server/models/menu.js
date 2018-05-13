const mongoose = require('mongoose');

const { Schema } = mongoose;

const MenuSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Menu = mongoose.model('Menu', MenuSchema);

module.exports = Menu;
