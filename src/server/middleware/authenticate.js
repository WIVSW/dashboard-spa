const UserModel = require('../models/user');



const authenticate = (req, res, next) => {
	const token = req.header('x-auth');

	UserModel
		.findByToken(token)
		.then((user) => {
			if (!user)
				return Promise.reject();

			req.user = user;
			req.token = token;
			next();
		})
		.catch(
			(err) => res
				.status(401)
				.send({ message: err.message, data: null })
		);
};

module.exports = authenticate;
