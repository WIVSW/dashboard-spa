const Connection = require('./connection');

const connection = new Connection('localhost', '27017', 'DashboardSPA');

connection.init();
