import Model from './base';


class TableCell extends Model {
	_parse(data) {
		this.key = data['key'];
		this.value = data['value'];
		this.component = data['component'];
	}

	static fromData(data) {
		return new TableCell(data)
	}

	static fromDataArray(data) {
		return data.map((item) => TableCell.fromData(item))
	}
}

export default TableCell;