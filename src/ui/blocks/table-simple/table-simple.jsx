import React, { PureComponent } from 'react';

import '../table/table.scss';

class TableSimple extends PureComponent {
	render() {
		const table = this.props.table;
		return (
			<table className="table" style={this.props.style}>
				<tbody>
				<tr className="table__head table__row">
					{table.head.map((item, i) => <th key={i} className="table__cell table__cell-in-head">{item}</th>)}
				</tr>
				{table.body.map((row, i) => {
					return (
						<tr key={i} className="table__body-row table__row">
							{table.head.map((key, j) => {
								const cell = this._getCellByKey(key, row);
								return (
									<td key={j} className="table__cell">
										{ cell.value }
									</td>
								);
								
							})}
						</tr>
					);
				})}
				</tbody>
			</table>
		);
	}
	
	_getCellByKey(key, row) {
		return row.find((cell) => cell.key === key);
	}
};

export default TableSimple;
