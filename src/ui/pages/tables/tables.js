import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../base';
import Table from '../../blocks/table/table.jsx';
import TableModel from '../../models/table';



class Tables extends Page {
	preload() {
		return Promise
			.all([
				this.props.ingredientsGroupApi.read()
			]);
	}

	getTemplate() {
		console.log(this.state);
		return <Table table={this.state.table}/>
	}

	_saveState(data) {
		const groups = data[0];
		const table = new TableModel(this._parseTable(groups));
		this.setState({ groups, table })
	}

	_parseTable(data) {
		const table = { head: ['Name', 'View', 'Delete'], body: []};
		data.forEach((group) => {
			const row = { id: group._id, cells: [] };

			const name = (data) => <span contentEditable={true} suppressContentEditableWarning>{data.children}</span>;
			const link = (data) => <Link style={{color: 'blue'}} to={`/tables/${group._id}`}>{data.children}</Link>;
			const deleteBtn = (data) => <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => this._deleteIngredientGroup(group._id)}>{data.children}</span>;

			row.cells.push({ 'key': 'Name', 'value': group.name, 'component': name });
			row.cells.push({ 'key': 'View', 'value': 'View', 'component': link });
			row.cells.push({ 'key': 'Delete', 'value': 'Delete', 'component': deleteBtn });

			table.body.push(row);
		});
		return table;
	}

	_deleteIngredientGroup(groupId) {
		console.log(groupId);
		this.props.ingredientsGroupApi
			.delete([groupId])
			.then(() => {
				const { table } = this.state;

				table.body = table.body.filter((row) => row.id !== groupId);
				this.setState({ table });
				console.log(this.state)
			});
	}
}

export default Tables;
