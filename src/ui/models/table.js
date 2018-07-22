import Model from './base';
import TableCell from './table-cell';


class Table extends Model {
	_parse(data) {
		/** @type {Array<string>} */
		this.head = data['head'];

		/** @type {Array<TableCell>} */
		this.body = data['body'].map((row) => this._parseRow(row))
	}

	getCellByKey(key, id) {
		const row = this.body.find((row) => row.id === id);
		return (row && row.cells.find((cell) => cell.key === key)) || null;
	}

	_parseRow(data) {
		return {
			id: data['id'],
			cells: TableCell.fromDataArray(data['cells']),
			url: data['url'],
			filterId: data['filterId']
		};
	}
}

export default Table;