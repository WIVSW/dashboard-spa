import React from 'react';
import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from '../../models/table';

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
				this._allIngredients = data[0];
				this._product = data[1] &&
					(data[1].length && data[1][0]) || null;

				this._ingredients = this._product ?
					this._allIngredients.filter((ingredient) => this._product.ingredients.includes(ingredient._id)) :
					[];

				const table = new TableModel(this._parseTable(this._ingredients).table);

				return { table };
			})
	}

	getTemplate() {
		return (
			<div>
				<h1 style={{padding: '15px 30px'}}>{this._product.name}</h1>
				<Table table={this.state.table} showAddBtn={false}/>
			</div>
		);
	}

	_parseTable(data) {
		if (!data.length) {
			return {
				table: {
					head: ['Name', 'Supplier', 'Prime cost'],
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
}

export default Product;
