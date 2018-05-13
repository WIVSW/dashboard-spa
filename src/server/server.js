const express = require('express');
const http = require('http');

const Connection = require('./connection');

const connection = new Connection('localhost', '27017', 'DashboardSPA');

connection.init();

let app = express();

http
    .createServer(app)
    .listen(3000);
