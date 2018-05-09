const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class Connection {
    constructor(host, port, db) {
        this.HOST = host;
        this.PORT = port;
        this.DB = db;
    }

    init() {
        return mongoose.connect(`mongodb://${this.HOST}:${this.PORT}/${this.DB}`);
    }
}


module.exports = Connection;
