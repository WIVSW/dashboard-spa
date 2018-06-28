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
				if (group && group.length) {
					data.title = group[0].name;
					return this.props.ingredientApi
						.getByIds(group[0].ingredients)
						.then((ingredients) => {
							const tableFiltered = this._parseTable(ingredients);
							const table = new TableModel(tableFiltered.table);
							const { filters } = tableFiltered;

							return { table, filters };
						})
				} else {
					return Promise.resolve({});
				}
			})
	}

	getTemplate() {
		return <TableFilterable
			table={this.state.table}
			filters={this.state.filters}
		/>
	}

	_parseTable(data) {
		const table = {
			head: []
		};

		const filters = [];

		table.body = data.map((row) => this._parseRow(row, table.head, filters));

		return { table, filters: filters.sort((a, b) => a.id - b.id) };
	}

	_parseRow(ingredient, tableHead, filters) {
		console.log(ingredient);
		const row = { id: ingredient._id, cells: [] };

		const setHead = (head) => {
			if (!tableHead.includes(head))
				tableHead.push(head);
		};
		const supplier = !!filters.length &&
			filters.find((filter) => filter.name === ingredient.supplier);

		if (!supplier) {
			const lastSupplier = filters.slice(-1)[0];
			const id = lastSupplier ? lastSupplier.id + 1 : 0;
			const name = ingredient.supplier;

			row.supplier = id;

			filters.push({ id, name });
		} else {
			row.supplier = supplier.id;
		}

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

		for(let key in ingredient.parameters) {
			const item = ingredient.parameters[key];
			setHead(key);
			row.cells.push({
				'id': ingredient._id,
				'key': key,
				'name': `parameter.${key}`,
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

export default Table;
