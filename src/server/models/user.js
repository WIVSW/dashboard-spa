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
    tokens: {
        type: Array,
        default: [],
        value: [
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
        ]
    },
    menus: {
        type: Array,
        default: [],
        value: [{
            type: Schema.Types.ObjectId,
            ref: 'Menu'
        }]
    },
    ingredientsGroups: {
        type: Array,
        default: [],
        value: [{
            type: Schema.Types.ObjectId,
            ref: 'IngredientsGroup'
        }]
    }
});

UserSchema.methods.toJSON = function() {
    const {_id, email, tokens, menus, ingredientsGroups} = this.toObject();

    return {_id, email, tokens, menus, ingredientsGroups};
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
