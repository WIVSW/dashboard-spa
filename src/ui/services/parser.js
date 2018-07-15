import { read, utils } from 'xlsx';



class Parser {
	constructor() {
		this._rABS = true;
	}

	parse(table) {
		return this
			._readTable(table)
			.then(this._parseWorkBook.bind(this));
	}

	_readTable(table) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.addEventListener('load', (e) => {
				let data = e.target.result;
				if (!this._rABS) data = new Uint8Array(data);
				const workbook = read(data, {type: this._rABS ? 'binary' : 'array'});

				resolve(workbook);
			});

			this._rABS ? reader.readAsBinaryString(table) : reader.readAsArrayBuffer(table);
		});
	}

	_parseWorkBook(workbook) {
		let sheets = this._prepareSheets(workbook);
		sheets = this._validateSheets(sheets);
		
		if (sheets.error)
			return Promise.reject(validSheets.message);
		
		sheets = this._bindValues(sheets);
		sheets = sheets.reduce((prev, curr) => prev.concat(curr.value), []);
		sheets = this._divideByCount(sheets);
		
		return sheets;
	}
	
	_prepareSheets(workbook) {
		const { Sheets, SheetNames } = workbook;
		
		const sheets = SheetNames.map((name) => {
			const value = utils.sheet_to_json(Sheets[name]);
			const keys = value
				.reduce((prev, curr) => {
					return prev.concat(Object.keys(curr));
				}, [])
				.filter(this._onlyUnique.bind(this));
			return { name, value, keys }
		});
		
		return sheets;
	}
	
	_validateSheets(sheets) {
		const getError = (txt) => ({error: true, message: txt});

		if (!sheets || !sheets.length)
			return getError('Table should have at least one sheet');
			
		const requiredKeys = ['name', 'primecost'];
		const sheetsKeys = sheets.map((sheet) => sheet.keys);
		const sheetsValues = sheets.map((sheet) => sheet.value);
		const keysNotEmpty = sheetsKeys.reduce((prev, curr) => prev && curr && curr.length, true);
		const valuesNotEmpty = sheetsValues.reduce((prev, curr) => prev && curr && curr.length, true);
		
		if (!valuesNotEmpty)
			return getError('Each sheet can\'t be empty');
		
		if (!keysNotEmpty)
			return getError('Each sheet should have the table headers');
		
		const requiredKeysSetted = sheetsKeys.reduce((prev, curr) => {
			return prev && curr.reduce((prev, curr) => requiredKeys.includes(curr), true)
		}, true);
		
		if (!requiredKeysSetted)
			return getError('Each sheet should include the "name" and "primecost" table headers');
		
		const isKeyLengthEqual = sheetsKeys
			.filter((keys) => sheetsKeys[0].length === keys.length).length === sheetsKeys.length;
		
		const isKeyInAllSheetsSame = sheetsKeys.reduce((prev, curr) => {
			return prev && curr.reduce((a, b) => a && sheetsKeys[0].includes(b), true)
		}, true);
		
		if (!isKeyLengthEqual || !isKeyInAllSheetsSame)
			return getError('Each sheet should have the same table headers');
		
		return sheets;
	}
	
	_bindValues(sheets) {
		const mapKeyType = this._getMapKeyType(sheets);
		
		sheets = sheets.map((sheet) => {
			sheet.value = sheet.value.map((row) => {
				row.supplier = sheet.name;
				
				sheet.keys.forEach((key) => {
						const type = mapKeyType[key];
						
						if (type === 'number') {
							const value = row[key];
							if (!value) {
								if (key === 'count')
									row[key] = '1';
								else
									row[key] = '0'
							}
							
							row[key] = this._tryGetNumber(row[key]);
						} else {
							const value = row[key];
							if (!value)
								row[key] = '';
						}
					});
				return row;
			});
			return sheet;
		});
		
		return sheets;
	}
	
	_divideByCount(rows) {
		return rows.map((row) => {
			const newRow = {};
			
			Object
				.keys(row)
				.forEach((key) => {
					if (key === 'count')
						return;
					
					if (typeof row[key] !== 'number') {
						newRow[key] = row[key];
						return;
					}

					newRow[key] = row[key] / row.count;
				});
			
			return newRow;
		});
	}
	
	_getMapKeyType(sheets) {
		const map = {};

		sheets
			.map((sheet) => sheet.keys)
			.reduce((prev, curr) => prev.concat(curr), [])
			.filter(this._onlyUnique.bind(this))
			.forEach((key) => {
				const isColNum = this._isColumnAreNumber(key, sheets);
				map[key] = isColNum ? 'number' : 'string';
			});

		return map;
	}
	
	_isColumnAreNumber(key, sheets) {
		const column = sheets.reduce((prev, curr) => {
			const columnSheet = curr.value
				.map((item) => item[key])
				.filter(Boolean);
			return prev.concat(columnSheet);
		}, []);
		
		const isColNumber = column.reduce((prev, curr) => {
			const number = this._tryGetNumber(curr);
			return prev && typeof number === 'number';
		}, true);
		
		return isColNumber;
	}
	
	_tryGetNumber(str) {
		const initial = str;
		
		if (str.includes(',')) {
			const digit = str.match(/\d{1,},\d{1,}/)[0];
			if (digit && digit.length)
				str = digit.replace(',', '.');
		}
		
		
		const parsed = parseFloat(str);
		const isWholeStringNumber = !initial.replace(/(\d{1,}(,|.)\d{0,})|(\d{1,})/g, '').length;
		
		return isWholeStringNumber ? parsed : initial;
	}
	
	_onlyUnique(val, i, arr) {
		return arr.indexOf(val) === i;
	}
}

export default Parser;
