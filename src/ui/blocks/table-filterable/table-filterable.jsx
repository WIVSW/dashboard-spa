import React, { PureComponent } from 'react';
import Table from '../table/table.jsx';
import Filters from '../filters/filters.jsx';



class TableFilterable extends PureComponent {
	constructor(props) {
		super(props);

		this.state = this._getInitialState();
	}

	componentWillReceiveProps(props) {
		if (props.table && table.head && table.body) {
			const { table, filters } = this._getTableWithFilters(props.table);
			this.setState({ table, filters })
		}
	}

	render() {
		return (
			<div>
				<Filters filters={this.state.filters} onFilterSelected={this._onFilterSelected.bind(this)}/>
				<Table
					table={this.state.table}

					onRowDelete={(id) => this.props.onRowDelete(id)}
					onSave={(changes) => this.props.onSave(changes)}
					onAdd={(data) => this.props.onAdd(data)}
				/>
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
		const { table, filters }  = this._getTableWithFilters(this.props.table);
		return { table, filters }
	}

	_getTableWithFilters(table) {
		let filters = [];

		table.body = table.body.map((row, i) => {
			const key = row.cells.find((cell) => cell.key === this.props.filterKey).value;
			const filter = !!filters.length &&
			filters.find((filter) => filter.name === key);

			if (!filter) {
				const lastFilter = filters.slice(-1)[0];
				const id = lastFilter ? lastFilter.id + 1 : 0;
				const name = key;

				row.filterId = id;

				filters.push({ id, name });
			} else {
				row.filterId = filter.id;
			}

			return row;
		});

		return { table, filters };
	}
}


export default TableFilterable;
