import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from './blocks/layout/layout';

import Home from './pages/home/home';
import Products from './pages/products/products';
import Table from './pages/table/table';
import Tables from './pages/tables/tables';
import Login from './pages/login/login';
import Menu from './pages/menu/menu';
import Menus from './pages/menus/menus';
import NotFound from './pages/not-found/not-found';



export default (props) => {
	const authCheck = (component) => props.api.user.isAuth() ?
		component : <Redirect to="/login/" />;

	const needLoginCheck = (component) => !props.api.user.isAuth() ?
		component : <Redirect to="/" />;

	return (
		<Layout userApi={props.api.user}>
			<Switch>
				<Route path="/products/" component={(props) => authCheck(<Products {...props}/>)}/>
				<Route path="/tables/:id" component={(props) => authCheck(<Table {...props}/>)}/>
				<Route path="/tables/" component={(props) => authCheck(<Tables {...props}/>)}/>
				<Route path="/login/" component={(deps) => needLoginCheck(<Login userApi={props.api.user} {...deps} />)}/>
				<Route path="/menus/:id" component={(props) => authCheck(<Menu {...props}/>)}/>
				<Route path="/menus/" component={(props) => authCheck(<Menus {...props}/>)}/>
				<Route path="/" exact component={(props) => authCheck(<Home {...props}/>)}/>
				<Route component={NotFound}/>
			</Switch>
		</Layout>
	);
}
