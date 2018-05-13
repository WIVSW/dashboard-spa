const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        unique: true,
        validate: {
            validator: (string) => {
                return /[\w\d]{3,}@[\w\d]{3,}.[\w]{1,}/i.test(string);
            },
            message: '{VALUE} is not a valid email!'
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ],
    menus: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }],
    ingredientsGroups: [{
        type: Schema.Types.ObjectId,
        ref: 'IngredientsGroup'
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
