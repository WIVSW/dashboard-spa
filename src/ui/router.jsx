import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Layout from './blocks/layout/layout';
import Auth from './auth';

import Home from './pages/home/home';
import Product from './pages/product/product.jsx'
import ProductTotal from './pages/product-total/product-total.jsx';
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
				<Route
					path="/products/:id/total/"
					component={(deps) => authCheck(
						<ProductTotal
							{...deps}
						/>, deps)}
				/>
				
				<Route
					path="/products/:id"
					component={(deps) => authCheck(
						<Product
							productApi={props.api.product}
							ingredientApi={props.api.ingredient}
							{...deps}
						/>, deps)}
				/>

				<Route path="/products/" component={(deps) => authCheck(<Products productApi={props.api.product} {...deps}/>, deps)}/>
				<Route path="/tables/:id" component={(deps) => authCheck(
					<Table
						{...deps}
						ingredientsGroupApi={props.api.ingredientsGroup}
						ingredientApi={props.api.ingredient}
					/>,
					deps
				)}/>

				<Route path="/tables/" component={(deps) => authCheck(
					<Tables
						{...deps}
						ingredientsGroupApi={props.api.ingredientsGroup}
						serviceParser={props.services.parser}
					/>,
					deps
				)}/>
				<Route path="/login/" component={(deps) => needLoginCheck(<Login userApi={props.api.user} {...deps} />)}/>
				<Route path="/menus/:id" component={(deps) => authCheck(
					<Menu
						menuApi={props.api.menu}
						productApi={props.api.product}
						{...deps}
					/>, deps
				)}/>
				<Route path="/menus/" component={(deps) => authCheck(<Menus menuApi={props.api.menu} {...deps}/>, deps)}/>
				<Route path="/" exact component={(deps) => authCheck(<Home {...deps}/>, deps)} />
				<Route component={(deps) => authCheck(<NotFound {...deps}/>, deps)}/>
			</Switch>
		</Layout>
	);
}
