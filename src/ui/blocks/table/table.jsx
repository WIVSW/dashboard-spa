import React from 'react';

import './table.scss';

export default (props) => {
	console.log(props);
	return (
		<table className="table">
			<tbody>
				<tr className="table__head table__row">
					{props.table.head.map((item, i) => <th key={i} className="table__cell table__cell-in-head">{item}</th>)}
				</tr>
				{props.table.body.map((item, i) =>
					<tr key={i} className="table__body-row table__row">
						{props.table.head.map((key, j) => <td key={j} className="table__cell">{item[key]}</td>)}
					</tr>
				)}
			</tbody>
		</table>
	)
};