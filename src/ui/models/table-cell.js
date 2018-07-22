import Model from './base';


class TableCell extends Model {
	_parse(data) {
		this.id = data['id'];
		this.key = data['key'];
		this.name = data['name'];
		this.value = data['value'];
		this.component = data['component'];
		this.initValue = data['initValue'];
		this.editable = data['editable'];
		this.changed = data['changed'];

	}

	static fromData(data) {
		return new TableCell(data)
	}

	static fromDataArray(data) {
		return data.map((item) => TableCell.fromData(item))
	}
}

export default TableCell;