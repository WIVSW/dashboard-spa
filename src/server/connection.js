const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class Connection {
	constructor() {}

	init() {
		return mongoose.connect(process.env.MONGODB_URI);
	}
}


module.exports = Connection;
