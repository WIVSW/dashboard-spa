require('../config/config');

const express = require('express');
const http = require('http');

const Connection = require('./connection');
const Router = require('./router');

let app = express();

const connection = new Connection();
const router = new Router({app, router: express.Router()});

connection.init();

http
	.createServer(app)
	.listen(process.env.PORT);
