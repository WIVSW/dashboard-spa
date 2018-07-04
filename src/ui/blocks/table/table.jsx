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
		this.state.showAddBtn = typeof this.props.showAddBtn === 'undefined' ? true : this.props.showAddBtn;
	}

	componentWillReceiveProps(props) {
		const body = props.table.body.map((row) => {
			const hasControls = row.cells.find((cell) => cell.key === this.KEY_CONTROLS);

			if (hasControls) {
				return row;
			} else {
				return this._parseRow(row);
			}
		});
		this.setState({ body });
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
						return (
							<tr key={i} className="table__body-row table__row">
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
				{this.state.showAddBtn ? (
					<Button
						className={`table__btn btn_full-width`}
						onClick={() => this._onAddNew()}
					>Add new</Button>
				) : null}
				<Button
					className={`table__btn`}
					onClick={() => this._onSave()}
				>Save Changes</Button>
				<Popup
					title="Add new item"
					isVisible={this.state.popupVisible}
					onSend={this._onSend.bind(this)}
					onClose={() => this._onPopupClose()}
					getCustomKeyProp={this._getCustomKeyProp.bind(this)}
					form={this.props.customForm || this._generateForm(this._getKeysWithoutControls())}
				/>
			</div>
		)
	}

	_getKeysWithoutControls() {
		const row = this.state.body[0];
		if (!row) return [];
		const { cells } = row;


		return this.state.head
			.filter((key) => key !== this.KEY_CONTROLS)
			.map((key) => {
				const item = cells.find((item) => item.key === key);
				return item.name;
			});
	}

	_generateForm(keys) {
		const form = { action: 'Send', inputs: [] };

		form.inputs = keys.map((key) => {
			const placeholder = key.includes('.') ?
				this._getCustomKeyProp(key).prop : key;
			return {
				"name": key,
				"export": true,
				"valid": false,
				"placeholder": `Type the ${placeholder.toLowerCase()} here`,
				"type": "text",
				"value": "",
				"validation": {
					"required": true,
					"pattern": [
						"[\\S]{1,}",
						"i"
					]
				},
				"message": "",
				"error": `The ${key} can't be empty`
			};
		});

		return form;
	}

	_parseTable(table) {
		table.head.push(this.KEY_CONTROLS);
		table.body.map((row) => this._parseRow(row));

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

	_onPopupClose() {
		this.setState({ popupVisible: false })
	}

	_onInput(e, cell) {
		cell.value = e.target.textContent;
		cell.changed = cell.value !== cell.initValue;
	}

	_onAddNew() {
		this.setState({ popupVisible: true });

		return Promise.resolve();
	}

	_onSend(data) {
		return this.props
			.onAdd(data)
			.then((response) => {
				const { body } = this.state;

				response.forEach((row) => body.push(this._parseRow(row)));

				this.setState({ body, popupVisible: false });

				return Promise.resolve();
			})
	}

	_onSave() {
		const changed = {};

		this.state.body
			.forEach((row) => {
				const changedCells = {};

				row.cells.forEach((cell) => {
					if (cell.changed) {
						if (cell.name.includes('.')) {
							const key = this._getCustomKeyProp(cell.name).key;
							changedCells[key] = {};

							row.cells.forEach((cell) => {
								if (cell.name && cell.name.includes(`${key}.`)) {
									const customKey = this._getCustomKeyProp(cell.name).prop;
									changedCells[key][customKey] = cell.value;
								}
							})
						} else {
							changedCells[cell.name] = cell.value;
						}
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

	_parseRow(row) {

		row.cells = TableCell.fromDataArray(row.cells);

		row.cells.push(this._getConrols(row));

		return row;
	}

	_getCustomKeyProp(string) {
		const arrKeyProp = string.split('.');
		const key = arrKeyProp[0];
		const prop = arrKeyProp[1];

		return { key, prop };
	}
};

export default Table;
