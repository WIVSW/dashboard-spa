import XLSX from 'xlsx';



class Parser {
	constructor() {
		this._rABS = true;
	}

	parse(table) {
		return this
			._readTable(table)
			.then((workbook) => {
				console.log(workbook);
			});
	}

	_readTable(table) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.addEventListener('load', (e) => {
				let data = e.target.result;
				if (!this._rABS) data = new Uint8Array(data);
				const workbook = XLSX.read(data, {type: this._rABS ? 'binary' : 'array'});

				resolve(workbook);
			});

			this._rABS ? reader.readAsBinaryString(table) : reader.readAsArrayBuffer(table);
		});
	}

}

export default Parser;
