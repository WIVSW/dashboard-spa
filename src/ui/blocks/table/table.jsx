import React from 'react';

import './table.scss';

export default (props) => {
	return (
		<table className="table">
			<tbody>
				<tr className="table__head table__row">
					{props.table.head.map((item, i) => <th key={i} className="table__cell table__cell-in-head">{item}</th>)}
				</tr>
				{props.table.body.map((row, i) =>
					<tr key={row.id} className="table__body-row table__row">
						{props.table.head.map((key, j) => {
							const cell = props.table.getCellByKey(key, row.id);
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
				)}
			</tbody>
		</table>
	)
};