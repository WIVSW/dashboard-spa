import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/home/home';
import Login from './pages/login/login';



export default () => (
	<BrowserRouter>
		<Switch>
			<Route path="/login" component={Login}/>
			<Route path="/" exact component={Home}/>
		</Switch>
	</BrowserRouter>
);