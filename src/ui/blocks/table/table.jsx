import React, {PureComponent} from 'react';

import { Link } from 'react-router-dom';
import TableCell from '../../models/table-cell';
import Button from '../button/button.jsx';
import Popup from '../popup/popup.jsx';

import './table.scss';

class Table extends PureComponent {
	constructor(props) {
		super(props);

		this.KEY_CONTROLS = 'Controls';

		const table = this._parseTable(props.table);
		this.state = table;
		this.state.getCellByKey = table.getCellByKey;
		this.state.popupVisible = false;
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
													<Wrap contentEditable={!!cell.editable} onInput={(e) => this._onInput(e, cell)}>{cell.value}</Wrap> :
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
				<Button
					className={`table__btn btn_full-width`}
					onClick={() => this._onAddNew()}
				>Add new</Button>
				<Button
					className={`table__btn`}
					onClick={() => this._onSave()}
				>Save Changes</Button>
				<Popup isVisible={this.state.popupVisible} />
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

	_onInput(e, cell) {
		cell.value = e.target.textContent;
		cell.changed = cell.value !== cell.initValue;
	}

	_onAddNew() {
		this.setState({ popupVisible: true });

		return Promise.resolve();
	}

	_onSave() {
		const changed = {};

		this.state.body
			.forEach((row) => {
				const changedCells = {};

				row.cells.forEach((cell) => {
					if (cell.changed) {
						changedCells[cell.name] = cell.value;
					}
				});

				if (Object.keys(changedCells).length) {
					changed[row.id] = changedCells;
				}
			});

		if (Object.keys(changed).length) {
			return this.props.onSave(changed);
		} else {
			return Promise.reject();
		}
	}
};

export default Table;
