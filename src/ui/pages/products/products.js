import React from 'react';

import Page from '../base';
import TableModel from "../../models/table";
import ProductModel from "../../models/product";
import Table from "../../blocks/table/table.jsx";



class Products extends Page {
	constructor(props) {
		super(props);

		this.URL = '/products/';

		this.state = {};
	}

	preload() {
		return this.props.productApi
			.read()
			.then((products) => {
				this._products = products.map((product) => new ProductModel(product));

				const table = new TableModel(this._parseTable(this._products));

				return { table };
			});
	}

	getTemplate() {
		return <Table
				table={this.state.table}

				onRowDelete={(id) => this._deleteIngredientGroup(id)}
				onSave={(changes) => this._onSave(changes)}
				onAdd={this._onAdd.bind(this)}
			/>;
	}

	_parseTable(data) {
		if (!data.length) {
			return {
				head: ['Name', 'Price'],
				body: []
			}
		}

		const table = {
			head: ['Name', 'Price']
		};

		table.body = data.map((row) => this._parseRow(row));

		return table;
	}

	_parseRow(product) {
		const row = { id: product._id, cells: [], url: `${this.URL}${product._id}/total/` };

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
				});

				return productModels;
			});
	}
}

export default Products;
