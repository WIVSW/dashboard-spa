import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import TableCell from '../../models/table-cell';

import './table.scss';

class Table extends PureComponent {
	constructor(props) {
		super(props);

		this.KEY_CONTROLS = 'Controls';

		const table = this._parseTable(props.table);
		this.state = table;
		this.state.getCellByKey = table.getCellByKey;
	}

	render() {
		const table = this.state;
		return (
			<div>
				<table className="table">
					<tbody>
					<tr className="table__head table__row">
						{table.head.map((item, i) => <th key={i} className="table__cell table__cell-in-head">{item}</th>)}
					</tr>
					{table.body.map((row, i) => {
						row.cells.push(this._getConrols(row));
						return (
							<tr key={row.id} className="table__body-row table__row">
								{table.head.map((key, j) => {
									const cell = table.getCellByKey(key, row.id);
									let Wrap = cell.component;
									return (
										<td key={j} className="table__cell">
											{
												cell.component ?
													<Wrap>{cell.value}</Wrap> :
													cell.value
											}
										</td>
									);

								})}
							</tr>
						);
					})}
					</tbody>
				</table>
				<button className="table__btn" onClick={() => this._onSave()}>Save Changes</button>
			</div>
		)
	}

	_parseTable(table) {
		table.head.push(this.KEY_CONTROLS);

		return table;
	}

	_getConrols(data) {
		const controls = {};

		controls.key = this.KEY_CONTROLS;
		controls.component = (props) => (
			<div className={`table__controls`}>
				{data.url ? <Link to={data.url} className={`table__control icon-eye`}/> : null}
				<button className="table__control icon-cancel" onClick={() => this._deleteRow(data.id)}></button>
			</div>
		);


		return new TableCell(controls);
	}

	_deleteRow(id) {
		return this.props
			.onRowDelete(id)
			.then(() => {
				let { body } = this.state;

				body = body.filter((row) => row.id !== id);

				this.setState({ body });
			})
	}

	_onSave() {}
};

export default Table;
