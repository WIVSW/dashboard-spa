import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from './blocks/layout/layout';
import Auth from './auth';

import Home from './pages/home/home';
import Products from './pages/products/products';
import Table from './pages/table/table';
import Tables from './pages/tables/tables';
import Login from './pages/login/login';
import Menu from './pages/menu/menu';
import Menus from './pages/menus/menus';
import NotFound from './pages/not-found/not-found';



export default (props) => {
	const authCheck = (component, deps) => <Auth {...deps} userApi={props.api.user} component={component} />;

	const needLoginCheck = (component) => !props.api.user.isAuth() ?
		component : <Redirect to="/" />;

	return (
		<Layout userApi={props.api.user}>
			<Switch>
				<Route path="/products/" component={(deps) => authCheck(<Products {...deps}/>, deps)}/>
				<Route path="/tables/:id" component={(deps) => authCheck(<Table {...deps}/>, deps)}/>
				<Route path="/tables/" component={(deps) => authCheck(<Tables {...deps} ingredientsGroupApi={props.api.ingredientsGroup}/>, deps)}/>
				<Route path="/login/" component={(deps) => needLoginCheck(<Login userApi={props.api.user} {...deps} />)}/>
				<Route path="/menus/:id" component={(deps) => authCheck(<Menu {...deps}/>, deps)}/>
				<Route path="/menus/" component={(deps) => authCheck(<Menus {...deps}/>, deps)}/>
				<Route path="/" exact component={(deps) => authCheck(<Home {...deps}/>, deps)} />
				<Route component={(deps) => authCheck(<NotFound {...deps}/>, deps)}/>
			</Switch>
		</Layout>
	);
}
