import React from 'react';
import Page from '../base';
import { Link } from 'react-router-dom';
import Button from "../../blocks/button/button.jsx";
import TableSimple from '../../blocks/table-simple/table-simple.jsx';
import Popup from '../../blocks/popup/popup.jsx';
import ExportForm from '../product/export-form.json';


class ProductTotal extends Page {
	preload() {
		const { id } = this.props.match.params;
		return this.props.productCalculator
			.getProductTotalById(id)
			.then((data) => {
				data.tables = {};
				data.tables.product = this._parseProductTable(data.product);
				data.tables.ingredients = this._parseIngredientsTable(data.ingredients);
				data.exportVisible = false;
				return data;
			});
	}
	
	getTemplate() {
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
					>
						Total
					</Button>
					<Button
						style={{
							display: 'inline-block',
							margin: '0 15px 0 0'
						}}
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
				<Button
					style={
						{
							display: 'inline-block',
							margin: '0 0 0 30px'
						}
					}
					onClick={this._onExportClick.bind(this)}
				>Export to DOCX</Button>
				<h1 style={{padding: '15px 30px'}}>Product keys</h1>
				<TableSimple table={this.state.tables.product} />
				{
					this.state.tables.ingredients ?
						(
							<div
								style={{
									width: '100%',
									overflow: 'auto'
								}}
							>
								<h1 style={{padding: '15px 30px'}}>Ingredients keys</h1>
								<TableSimple
									table={this.state.tables.ingredients}
									style={{width: 'auto', minWidth: '100%'}}
								/>
							</div>
						)
						:
						(
							<h1 style={{padding: '15px 30px'}}>
								No ingredients added yet.
							</h1>
						)
				}
				<Popup
					title="Add new item"
					isVisible={this.state.exportVisible}
					onSend={this._onExportSend.bind(this)}
					onClose={this._onExportClose.bind(this)}
					form={ExportForm}
				/>
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
		if (!ingredients || !ingredients.length)
			return null;
			
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
	
	_onExportClick() {
		this.setState({ exportVisible: true });
		return Promise.resolve();
	}
	
	_onExportSend(data) {
		const { id } = this.props.match.params;
		return this.props.serviceParser
			.parseWord(data['table'], data['name'], id)
			.then((data) => {
				console.log('result', data)
				return Promise.resolve();
			})
	}
	
	_onExportClose() {
		this.setState({ exportVisible: false });
		return Promise.resolve();
	}
}


export default ProductTotal;
