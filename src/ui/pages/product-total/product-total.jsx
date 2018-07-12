import React from 'react';
import Page from '../base';
import { Link } from 'react-router-dom';
import Button from "../../blocks/button/button.jsx";
import TableSimple from '../../blocks/table-simple/table-simple.jsx';


class ProductTotal extends Page {
	preload() {
		const { id } = this.props.match.params;
		return this.props.productCalculator
			.getProductTotalById(id)
			.then((data) => {
				data.tables = {};
				data.tables.product = this._parseProductTable(data.product);
				data.tables.ingredients = this._parseIngredientsTable(data.ingredients);
				return data;
			});
	}
	
	getTemplate() {
		console.log(this.state);
		return  (
			<div>
				<h1 style={{padding: '15px 30px'}}>{this.state.product.name}</h1>
				<div className="filters">
					<Button
						style={{
							display: 'inline-block',
							margin: '0 15px 0 0'
						}}
						status={Button.Status.SELECTED}
						onClick={() => Promise.resolve()}
					>
						Total
					</Button>
					<Button
						style={{
							display: 'inline-block',
							margin: '0 15px 0 0'
						}}
						onClick={() => Promise.resolve()}
					>
						<Link
							style={{
								color: 'inherit',
								textDecoration: 'none'
							}}
							to={`/products/${this.props.match.params.id}/`}
						>
							Ingredients
						</Link>
					</Button>
				</div>
				<h1 style={{padding: '15px 30px'}}>Product keys</h1>
				<TableSimple table={this.state.tables.product} />
				<div
					style={{
						width: '100%',
						overflow: 'auto'
					}}
				>
					<h1 style={{padding: '15px 30px'}}>Ingredients keys</h1>
					<TableSimple table={this.state.tables.ingredients} style={{width: 'auto', minWidth: '100%'}}/>
				</div>
			</div>
		);
	}
	
	_parseProductTable(product) {
		const table = {};
		
		table.head = ['Key', 'Property'];
		table.body = [];
		
		Object
			.keys(product)
			.forEach((key) => {
				const row = [];
				
				row.push({
					key: 'Key',
					value: this.props.productCalculator.getProductKey(key)
				});
				
				row.push({
					key: 'Property',
					value: product[key]
				});
				
				table.body.push(row);
			});
		
		return table;
	}
	
	_parseIngredientsTable(ingredients) {
		const table = {};
		
		table.head = Object.keys(ingredients[0]).map((key) => this.props.productCalculator.getIngredientKey(key));
		table.body = ingredients.map((ingredient) => {
			const row = [];
			
			Object
				.keys(ingredient)
				.forEach((key) => row.push({
					key: this.props.productCalculator.getIngredientKey(key),
					value: ingredient[key]
				}));
			
			return row;
		});
		
		return table;
	}
}


export default ProductTotal;
