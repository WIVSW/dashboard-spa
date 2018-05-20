const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
	const {_id, email} = this.toObject();
	return {_id, email};
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

UserSchema.statics.findByCredentials = function(email, password) {

	return this
		.findOne({ email })
		.then((user) => {
			if (!user)
				return Promise.reject();

			return new Promise((resolve, reject) => {
				bcrypt.compare(password, user.password, (err, res) => {
					if (!err && res)
						resolve(user);
					else
						reject();
				})
			});
		})
};

UserSchema.pre('save', function(next) {
	if (this.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) =>
			bcrypt.hash(this.password, salt, (err, hash) => {
				this.password = hash;
				next();
			})
		);
	} else {
		next();
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
