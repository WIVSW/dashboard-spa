import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from '../../models/table';



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
		return <Table table={this.state.table} onRowDelete={(id) => this._deleteIngredientGroup(id)}/>
	}

	_saveState(data) {
		const groups = data[0];
		const table = new TableModel(this._parseTable(groups));
		this.setState({ groups, table })
	}

	_parseTable(data) {
		const table = { head: ['Name'], body: []};
		data.forEach((group) => {
			const row = { id: group._id, cells: [], url: `${this.URL}${group._id}` };

			const name = (data) => <span contentEditable={true} suppressContentEditableWarning>{data.children}</span>;

			row.cells.push({ 'key': 'Name', 'value': group.name, 'component': name });

			table.body.push(row);
		});
		return table;
	}

	_deleteIngredientGroup(groupId) {
		return this.props.ingredientsGroupApi.delete([groupId]);
	}
}

export default Tables;
