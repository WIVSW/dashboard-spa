import React, { PureComponent } from 'react';
import Table from '../table/table.jsx';
import Filters from '../filters/filters.jsx';



export default class extends PureComponent {
	constructor(props) {
		super(props);

		this.props = props;
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
		const { head, body } = this.props.table;
		const result = { head };

		result.body = body.filter((item) => item.supplier === id);

		if (!result.body.length)
			result.body = this.props.table.body;

		return result;
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
