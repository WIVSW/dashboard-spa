import React from 'react';
import Page from '../base';
import TableFilterable from '../../blocks/table-filterable/table-filterable.jsx';
import TableModel from "../../models/table";



class Table extends Page {
	constructor(props) {
		super(props);

		this.state = {};
	}

	preload() {
		const { id } = this.props.match.params;
		const data = {};
		return this.props.ingredientsGroupApi
			.getByIds([ id ])
			.then((group) => {
				const parse = (ingredients) => {
					const tableFiltered = this._parseTable(Array.isArray(ingredients) ? ingredients : []);
					data.table = new TableModel(tableFiltered.table);
					
					return data;
				}
				if (group && group.length) {
					data.group = group[0];
					return this.props.ingredientApi
						.getByIds(data.group.ingredients)
						.then(parse, parse)
				} else {
					data.table = new TableModel({ head: [], body: [] });
					return data;
				}
			})
	}

	getTemplate() {
		return <div>
			<h1 style={{padding: '15px 30px'}}>{this.state.group.name}</h1>
			<TableFilterable
				table={this.state.table}
				filterKey={'Supplier'}

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

	_deleteIngredientGroup(id) {
		return this.props.ingredientApi.delete([id]);
	}
	_onSave(changes) {
		for(let key in changes)
			changes[key]['group'] = this.state.group;

		return this.props.ingredientApi.update(changes);
	}
	_onAdd(data) {
		data['group'] = this.state.group._id;
		return this.props.ingredientApi
			.create([ data ])
			.then((ingredients) => ingredients.map((ingredient) => this._parseRow(ingredient, this.state.table.head)));
	}
}

export default Table;
