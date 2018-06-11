import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from './layout';

import Home from './pages/home/home';
import Products from './pages/products/products';
import Table from './pages/table/table';
import Tables from './pages/tables/tables';
import Login from './pages/login/login';
import Menu from './pages/menu/menu';
import Menus from './pages/menus/menus';
import NotFound from './pages/not-found/not-found';



export default (props) => {
	const authCheck = (component) => props.isAuth ?
		component : <Redirect to="/login/" />;

	return (
		<Layout showSidebar={props.isAuth}>
			<Switch>
				<Route path="/products/" component={() => authCheck(<Products/>)}/>
				<Route path="/tables/:id" component={() => authCheck(<Table/>)}/>
				<Route path="/tables/" component={() => authCheck(<Tables/>)}/>
				<Route path="/login/" component={Login}/>
				<Route path="/menus/:id" component={() => authCheck(<Menu/>)}/>
				<Route path="/menus/" component={() => authCheck(<Menus/>)}/>
				<Route path="/" exact component={() => authCheck(<Home/>)}/>
				<Route component={NotFound}/>
			</Switch>
		</Layout>
	);
}
