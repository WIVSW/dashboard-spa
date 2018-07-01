import React from 'react';

import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from "../../models/table";



class Menus extends Page {
	constructor(props) {
		super(props);

		this.URL = '/menus/';
	}

	preload() {
		return this.props.menuApi
			.read()
			.then((menus) => {
				let data;
				if (menus && menus.length) {
					const parsed = this._parseTable(menus);
					data = new TableModel(parsed);
				} else {
					data = new TableModel({ head: [], body: [] });
				}
				return { table: data };
			});
	}

	getTemplate() {
		return <Table
			table={this.state.table}

			onRowDelete={(id) => this._deleteIngredientGroup(id)}
			onSave={(changes) => this._onSave(changes)}
			onAdd={this._onAdd.bind(this)}
		/>
	}

	_parseTable(data) {
		return {
			head: ['Name'],
			body: data.map(this._parseRow.bind(this))
		};
	}

	_parseRow(menu) {
		const row = { id: menu._id, cells: [], url: `${this.URL}${menu._id}` };

		const name = (data) =>
			<span
				contentEditable={data.contentEditable}
				onInput={(e) => data.onInput(e)}
				suppressContentEditableWarning
			>
					{data.children}
				</span>;

		row.cells.push({
			'id': menu._id,
			'key': 'Name',
			'name': 'name',
			'value': menu.name,
			'component': name,
			'initValue': menu.name,
			'editable': true,
			'changed': false
		});

		return row;
	}

	_deleteIngredientGroup(id) {
		return this.props.menuApi.delete([id]);
	}

	_onAdd(data) {
		return this.props.menuApi
			.create([ data ])
			.then((groups) => groups.map(this._parseRow.bind(this)));
	}

	_onSave(changes) {
		return this.props.menuApi.update(changes);
	}
}

export default Menus;
