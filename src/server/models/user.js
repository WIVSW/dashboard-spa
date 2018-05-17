const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

UserSchema.methods.generateAuthToken = function() {
	const _id = this._id.toHexString();
	const access = 'auth';
	const token = jwt.sign({_id, access}, 'abc123').toString();

	this.tokens = this.tokens.concat([{access, token}]);

	return this
		.save()
		.then(() => token);
};

UserSchema.methods.toJSON = function() {
	const {_id, email, menus, ingredientsGroups} = this.toObject();

	return {_id, email, menus, ingredientsGroups};
};

UserSchema.statics.findByToken = function(token) {
	let decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (err) {
		return Promise.reject(err);
	}

	return this.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
