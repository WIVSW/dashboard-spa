import React from 'react';

import Page from '../base';
import TableModel from "../../models/table";
import ProductModel from "../../models/product";
import Table from "../../blocks/table/table.jsx";



class Menu extends Page {
	constructor(props) {
		super(props);

		this.URL = '/products/';

		this.state = {};
	}

	preload() {
		const { id } = this.props.match.params;
		const data = {};
		return this.props.menuApi
			.getByIds([ id ])
			.then((menu) => {
				if (menu && menu.length) {
					data.menu = menu[0];
					return this.props.productApi
						.read()
						.then((products) => {
							this._AllProducts = products.map((product) => new ProductModel(product));
							this._products = this._AllProducts.filter((product) => data.menu.products.includes(product._id));

							data.table = new TableModel(this._parseTable(this._products));

							return data;
						})
				} else {
					data.table = new TableModel({ head: ['Name', 'Price'], body: [] });
					return data;
				}
			})
	}

	getTemplate() {
		return <div>
			<h1 style={{padding: '15px 30px'}}>{this.state.menu.name}</h1>
			<Table
				table={this.state.table}

				onRowDelete={(id) => this._deleteIngredientGroup(id)}
				onSave={(changes) => this._onSave(changes)}
				onAdd={this._onAdd.bind(this)}
			/>
		</div>
	}

	_parseTable(data) {
		if (!data.length) {
			return {
				table: {
					head: ['Name', 'Price'],
					body: []
				}
			}
		}

		const table = {
			head: ['Name', 'Price']
		};

		table.body = data.map((row) => this._parseRow(row));

		return table;
	}

	_parseRow(product) {
		const row = { id: product._id, cells: [], url: `${this.URL}${product._id}` };

		const defaultComponent = (data) =>
			<span
				contentEditable={data.contentEditable}
				onInput={(e) => data.onInput(e)}
				suppressContentEditableWarning
			>
					{data.children}
				</span>;

		row.cells.push({
			'id': product._id,
			'key': 'Name',
			'name': 'name',
			'value': product.name,
			'component': defaultComponent,
			'initValue': product.name,
			'editable': true,
			'changed': false
		});

		row.cells.push({
			'id': product._id,
			'key': 'Price',
			'name': 'price',
			'value': product.price,
			'component': defaultComponent,
			'initValue': product.price,
			'editable': true,
			'changed': false
		});

		return row;
	}

	_deleteIngredientGroup(id) {
		return this.props.productApi.delete([id]);
	}
	_onSave(changes) {
		return this.props.productApi.update(changes);
	}
	_onAdd(data) {
		return this.props.productApi
			.create([ data ])
			.then((products) => {
				const productModels = products.map((product) => this._parseRow(product));

				productModels.forEach((model) => {
					this._products.push(model);
					this._AllProducts.push(model);
					this.state.menu.products.push(model.id);
				});

				const updateObj = {};
				updateObj[this.state.menu._id] = this.state.menu

				this.props.menuApi.update(updateObj);

				return productModels;
			});
	}
}

export default Menu;