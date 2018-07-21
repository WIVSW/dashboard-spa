import { read, utils } from 'xlsx';
import docx4js from "docx4js"


class Parser {
	constructor(deps) {
		this._rABS = true;
		
		this._calculator = deps.calculator;
	}
	
	parseWord(file, name, id) {
		return Promise
			.all([
				docx4js.load(file),
				this._calculator.getProductTotalById(id)
			])
			.then((data) => {
				const [ docx, total ] = data;
				const document = docx.officeDocument;
				return this
					._parseXml(document, total)
					.then(() => docx.save(`${name}.docx`));
			});
	}

	parseTable(table) {
		return this
			._readTable(table)
			.then(this._parseWorkBook.bind(this));
	}
	
	_parseXml(document, total) {
		const nodes = this._getAllTextNodes(document);
		const tables = this._getDocumentTables(document);
		this._markValidXmlTables(tables, document);

		this._replaceProductKey(nodes, total.product);
		this._replaceIngredientKey(total.ingredients, document);

		return Promise.resolve();
	}
	
	_replaceIngredientKey(ingredients, document) {
		const KEY = this._calculator.getIngredientKey('');
		const rowsShouldAddCount = ingredients.length - 1;
		const tables = document.content('w\\:tbl.valid');

		if (!tables.length) return;

		if (rowsShouldAddCount <= 0) return;
		
		
		for(let i = 0; i < tables.length; i++) {
			const tr = document.content(`w\\:tbl.valid:nth-of-type(${i + 1}) w\\:tr:last-child`);
			tr.addClass('iterable');
			
			for(let j = 0; j < rowsShouldAddCount; j++) {
				const cloned = document.content(`w\\:tbl.valid:nth-of-type(${i + 1}) w\\:tr:last-child`).clone();
				document
					.content(`w\\:tbl.valid:nth-of-type(${i + 1})`)
					.append(cloned)
			}
		}
		let tablesArr = [];
		for(let i = 0; i < tables.length; i++) {
			tablesArr[i] = [];
			const rows = document.content(`w\\:tbl.valid:nth-of-type(${i + 1}) w\\:tr.iterable`);
			for(let j = 0; j < rows.length; j++) {
				tablesArr[i][j] = rows[j];
			}
		}
		
		tablesArr = tablesArr.map(
			(table) => table.map((row) => this._findAllTextInChildren(row))
		);
		
		tablesArr.forEach((table) => {
			table.forEach((row, i) => {
				const ing = ingredients[i];
				const keys = Object.keys(ing);
				const replaceAllKeys = (str) => {
					keys.forEach((key) => {
						const currentKey = this._calculator.getIngredientKey(key);
						str = str.replace(currentKey, ing[key]);
					});
					return str;
				};
				
				row.forEach((cell) => {
					let value = cell.data;
					if (value.includes(KEY)) {
						cell.data = replaceAllKeys(value);
					}
				});
			});
		});
	}
	
	_getAllTextNodes(document) {
		return document.content("w\\:t");
	}
	
	_getDocumentTables(document) {
		return document.content("w\\:tbl");
	}
	
	_markValidXmlTables(tables, document) {
		const length = tables.length;
		const validTables = [];
		for(var i = 0; i < length; i++) {
			const rows = tables[i].children.filter((item) => item.name === 'w:tr');

			if (rows.length > 2) {
				validTables.push(false);
				continue;
			}
			
			const rowsWithText = rows.map((row) => this._findAllTextInChildren(row));
			const ingredientsRows = this._getIngredientsRows(rowsWithText);
			
			if (ingredientsRows.length !== 1) {
				validTables.push(false);
				continue;
			}
			
			validTables.push(true);
		}
		
		validTables.forEach((valid, i) => {
			const index = i + 1;
			if (valid) {
				document
					.content(`w\\:tbl:nth-of-type(${index})`)
					.addClass('valid');
			}
		});
	}
	
	_getIngredientsRows(rows) {
		const KEY = this._calculator.getIngredientKey('');
		return rows.filter((row) => {
			const hasIngredientKey = row.reduce((prev, curr) => {
				return prev || curr.data.includes(KEY);
			}, false);
			
			return hasIngredientKey;
		});
	}
	
	_findAllTextInChildren(row) {
		const children = this._getAllChildsRecursive(row);
		return children.filter((child) => child.type === 'text');
	}
	
	_getAllChildsRecursive(node) {
		let result = [];

		const getChildren = (elem) => {
			return elem.children ? elem.children : [];
		};
		
		const concatChilds = (children) => {
			result = result.concat(children);
		};

		const recursive = (elem) => {
			const children = getChildren(elem);
			concatChilds(children);
			children.forEach((child) => recursive(child))
		};
		
		recursive(node);
		
		return result;
	}
	
	_concatRecursive(array) {
		return array.reduce((a,b) => {
			const c = Array.isArray(b) && b.length ? this._concatRecursive(b) : b;
			return a.concat(c);
		});
	}
	
	_replaceProductKey(nodes, product) {
		const KEY = this._calculator.getProductKey('');
		const keys = Object.keys(product);
		const nodesLength = nodes.length;
		
		const replaceAllKeys = (str) => {
				keys.forEach((key) => {
					const currentKey = this._calculator.getProductKey(key);
					str = str.replace(currentKey, product[key]);
				});
			return str;
		};
		
		for(let i = 0; i < nodesLength; i++) {
			const childrenLength = nodes[i].children.length;
			for(let j = 0; j < childrenLength; j++) {
				const param = nodes[i].children[j];
				if (
					typeof param.data === 'string' &&
					param.data.includes(KEY)
				) {
					param.data = replaceAllKeys(param.data);
				}
			}
		}
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
		sheets = this._toIngredients(sheets);
		
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
	
	_toIngredients(rows) {
		return rows.map((row) => {
			const ingredientKeys = [
				'name',
				'group',
				'supplier',
				'parameters',
				'primecost'
			];
			const ingredient = { parameters: {} };
			
			Object
				.keys(row)
				.forEach((key) => {
					if (ingredientKeys.includes(key))
						ingredient[key] = row[key];
					else
						ingredient.parameters[key] = row[key];
				});
			
			return ingredient;
		})
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
