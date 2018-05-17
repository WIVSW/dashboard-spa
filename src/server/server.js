const express = require('express');
const http = require('http');

const Connection = require('./connection');
const Router = require('./router');

let app = express();

const connection = new Connection('localhost', '27017', 'DashboardSPA');
const router = new Router({app, router: express.Router()});

connection.init();

http
	.createServer(app)
	.listen(3000);
