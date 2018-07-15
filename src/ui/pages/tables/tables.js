import React from 'react';
import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from '../../models/table';

import TableForm from './table-form.json';



class Tables extends Page {
	constructor(props) {
		super(props);

		this.URL = '/tables/';
	}

	preload() {
		return Promise
			.all([
				this.props.ingredientsGroupApi.read()
			]);
	}

	getTemplate() {
		return <Table
			table={this.state.table}
			onRowDelete={(id) => this._deleteIngredientGroup(id)}
			onSave={(changes) => this._onSave(changes)}
			onAdd={this._onAdd.bind(this)}
			customForm={TableForm}
		/>
	}

	_saveState(data) {
		const groups = data[0];
		const table = new TableModel(this._parseTable(groups));
		this.setState({ groups, table })
	}

	_parseTable(data) {
		return {
			head: ['Name'],
			body: data.map(this._parseRow.bind(this))
		};
	}

	_parseRow(group) {
		const row = { id: group._id, cells: [], url: `${this.URL}${group._id}` };

		const name = (data) =>
			<span
				contentEditable={data.contentEditable}
				onInput={(e) => data.onInput(e)}
				suppressContentEditableWarning
			>
					{data.children}
				</span>;

		row.cells.push({
			'id': group._id,
			'key': 'Name',
			'name': 'name',
			'value': group.name,
			'component': name,
			'initValue': group.name,
			'editable': true,
			'changed': false
		});

		return row;
	}

	_deleteIngredientGroup(groupId) {
		return this.props.ingredientsGroupApi.delete([groupId]);
	}

	_onAdd(data) {
		return this.props.serviceParser
			.parse(data['table'])
			.then(() => Promise.reject('dev mode'));

		return this.props.ingredientsGroupApi
			.create([ data ])
			.then((groups) => groups.map(this._parseRow.bind(this)));
	}

	_onSave(changes) {
		return this.props.ingredientsGroupApi.update(changes);
	}
}

export default Tables;
