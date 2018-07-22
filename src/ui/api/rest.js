import Api from './base';



class Rest extends Api {
	constructor(deps) {
		super(deps);

		this.MODEL = deps.model;
	}

	getByIds(ids) {
		if (!ids.length) {
			return Promise.resolve([]);
		}

		return this._network
			.request(`${this.PATH}/${ids.join(',')}`)
			.then((data) => data.map((item) => new this.MODEL(item)));
	}

	create(data) {
		return this._network
			.request(`${this.PATH}/`, data, 'POST')
			.then((data) => data.map((item) => new this.MODEL(item)));
	}

	read() {
		return this._network
			.request(`${this.PATH}/`)
			.then((data) => data.map((item) => new this.MODEL(item)));

	}

	update(data) {
		const ids = Object.keys(data);
		return this._network
			.request(`${this.PATH}/${ids.join(',')}`, data, 'PATCH')
			.then((data) => data.map((item) => new this.MODEL(item)));
	}

	delete(ids) {
		return this._network
			.request(`${this.PATH}/${ids.join(',')}`, undefined, 'DELETE')
			.then((data) => data.map((item) => new this.MODEL(item)));
	}
}

export default Rest;
