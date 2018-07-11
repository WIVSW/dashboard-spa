import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from '../../models/table';
import Autocomplete from '../../blocks/autocomplete/autocomplete.jsx';
import IngredientModel from "../../models/ingredient";
import Button from '../../blocks/button/button.jsx';

class Product extends Page {
	constructor(props) {
		super(props);
	}

	preload() {
		const { id } = this.props.match.params;
		return Promise
			.all([
				this.props.ingredientApi.read(),
				this.props.productApi.getByIds([ id ])
			])
			.then((data) => {
				const allIngredients = data[0];
				const product = data[1] &&
					(data[1].length && data[1][0]) || null;

				const ingredients = product ?
					product.ingredients.map(
						(item) => {
							const found = allIngredients.find((ingredient) => ingredient._id === item.id);
							found.count = item.count;
							return found;
						}
					) :
					[];

				const table = new TableModel(this._parseTable(ingredients).table);

				return { table, product, ingredients, allIngredients };
			})
	}

	getTemplate() {
		return (
			<div>
				<h1 style={{padding: '15px 30px'}}>{this.state.product.name}</h1>
				<div className="filters">
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
							to={`/products/${this.state.product._id}/total/`}
						>
							Total
						</Link>
					</Button>
					<Button
						style={{
							display: 'inline-block',
							margin: '0 15px 0 0'
						}}
						status={Button.Status.SELECTED}
						onClick={() => Promise.resolve()}
					>
						Ingredients
					</Button>
				</div>
				<Autocomplete
					onAdd={(product) => this._onInputNew(product)}
					source={this.state.allIngredients}
					ignore={this.state.product.ingredients.map((ingredient) => ingredient.id)}
				/>
				<Table
					table={this.state.table}
					showAddBtn={false}

					onRowDelete={(id) => this._delete(id)}
					onSave={(changes) => this._onSave(changes)}
				/>
			</div>
		);
	}

	_parseTable(data) {
		if (!data.length) {
			return {
				table: {
					head: ['Name', 'Supplier', 'Count', 'Prime cost'],
					body: []
				}
			}
		}

		const table = {
			head: []
		};

		table.body = data.map((row) => this._parseRow(row, table.head));

		return { table };
	}

	_parseRow(ingredient, tableHead) {
		const row = { id: ingredient._id, cells: [] };

		const setHead = (head) => {
			if (!tableHead.includes(head))
				tableHead.push(head);
		};

		const defaultComponent = (data) =>
			<span
				contentEditable={data.contentEditable}
				onInput={(e) => data.onInput(e)}
				suppressContentEditableWarning
			>
					{data.children}
				</span>;

		setHead('Name');

		row.cells.push({
			'id': ingredient._id,
			'key': 'Name',
			'name': 'name',
			'value': ingredient.name,
			'component': defaultComponent,
			'initValue': ingredient.name,
			'editable': true,
			'changed': false
		});

		setHead('Supplier');

		row.cells.push({
			'id': ingredient._id,
			'key': 'Supplier',
			'name': 'supplier',
			'value': ingredient.supplier,
			'component': defaultComponent,
			'initValue': ingredient.supplier,
			'editable': true,
			'changed': false
		});
		
		setHead('Count');
		
		row.cells.push({
			'id': ingredient._id,
			'key': 'Count',
			'name': 'count',
			'value': ingredient.count,
			'component': defaultComponent,
			'initValue': ingredient.count,
			'editable': true,
			'changed': false
		});

		for(let key in ingredient.parameters) {
			const item = ingredient.parameters[key];
			setHead(key);
			row.cells.push({
				'id': ingredient._id,
				'key': key,
				'name': `parameters.${key}`,
				'value': item,
				'component': defaultComponent,
				'initValue': item,
				'editable': true,
				'changed': false
			});
		}

		setHead('Prime cost');

		row.cells.push({
			'id': ingredient._id,
			'key': 'Prime cost',
			'name': 'primecost',
			'value': ingredient.primecost,
			'component': defaultComponent,
			'initValue': ingredient.primecost,
			'editable': true,
			'changed': false
		});

		return row;
	}

	_onInputNew(ingredient) {
		const { product, ingredients } = this.state;
		const model = new IngredientModel(ingredient);
		model.count = 1;
		ingredients.push(model);
		product.ingredients.push({ id: model._id, count: 1});
		const parsedTable = this._parseTable(ingredients).table;

		const updateObj = {};
		updateObj[product._id] = product;

		return this.props.productApi
			.update(updateObj)
			.then((data) => {
				this.setState({
					table: {
						head: parsedTable.head,
						body: parsedTable.body,
						getCellByKey: parsedTable.getCellByKey,
						popupVisible: parsedTable.popupVisible,
						showAddBtn: parsedTable.showAddBtn
					},
					product: {
						ingredients: product.ingredients,
						_id: product._id,
						name: product.name,
						price: product.price
					},
					ingredients
				});
				return data;
			});
	}

	_delete(id) {
		const { product, ingredients, table } = this.state;
		const index = product.ingredients.findIndex((ingredient) => ingredient.id === id);
		product.ingredients.splice(index, 1);

		const updateObj = {};
		updateObj[product._id] = product;

		return this.props.productApi
			.update(updateObj)
			.then((data) => {
				this.setState({
					table: {
						head: table.head,
						body: table.body.filter((item) => item.id !== id),
						getCellByKey: table.getCellByKey,
						popupVisible: table.popupVisible,
						showAddBtn: table.showAddBtn
					},
					product: {
						ingredients: product.ingredients,
						_id: product._id,
						name: product.name,
						price: product.price
					},
					ingredients: ingredients.filter((item) => item._id !== id)
				});
				return data;
			});
	}

	_onSave(changes) {
		const { product } = this.state;
		for(let key in changes) {
			const ingredient = this.state.allIngredients.find((ingredient) => ingredient._id === key);
			changes[key]['group'] = ingredient.group;

			const { count } = changes[key];

			product.ingredients.forEach((ingredient) => {
				if (ingredient.id === key) {
					ingredient.count = count;
				}
			});

			delete changes[key]['count'];
		}
		
		const updateObj = {};
		updateObj[product._id] = product;

		return Promise
			.all([
				this.props.ingredientApi.update(changes),
				this.props.productApi.update(updateObj)
			])
			.then((data) => data[0]);
	}
}

export default Product;
