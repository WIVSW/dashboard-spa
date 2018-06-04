import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/home/home';
import Products from './pages/products/products';
import Table from './pages/table/table';
import Tables from './pages/tables/tables';
import Login from './pages/login/login';
import Menu from './pages/menu/menu';
import Menus from './pages/menus/menus';
import NotFound from './pages/not-found/not-found';



export default () => (
	<BrowserRouter>
		<Switch>
			<Route path="/products/" component={Products}/>
			<Route path="/tables/:id" component={Table}/>
			<Route path="/tables/" component={Tables}/>
			<Route path="/login/" component={Login}/>
			<Route path="/menus/:id" component={Menu}/>
			<Route path="/menus/" component={Menus}/>
			<Route path="/" exact component={Home}/>
			<Route component={NotFound}/>
		</Switch>
	</BrowserRouter>
);