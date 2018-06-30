import React, { PureComponent } from 'react';
import Table from '../table/table.jsx';
import Filters from '../filters/filters.jsx';



export default class extends PureComponent {
	constructor(props) {
		super(props);

		this.state = this._getInitialState();
	}

	render() {
		return (
			<div>
				<Filters filters={this.state.filters} onFilterSelected={this._onFilterSelected.bind(this)}/>
				<Table table={this.state.table}/>
			</div>
		);
	}

	_filterTable(id) {
		const table =  Object.assign({}, this.state.table);

		table.body = this.props.table.body.filter((item) => item.filterId === id);

		if (!table.body.length)
			table.body = this.props.table.body;

		return table;
	}

	_onFilterSelected(id) {
		this.setState({
			table: this._filterTable(id)
		});
	}

	_getInitialState() {
		const { filters, table } = this.props;
		return { filters, table }
	}
}
