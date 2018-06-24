import Rest from './base';



class Rest extends Api {
	constructor(deps) {
		super(deps);
	}

	getByIds(ids) {
		return this._network.request(`${this.PATH}/${ids.join(',')}`);
	}

	create(data) {
		return this._network.request(`${this.PATH}/`, data, 'POST');
	}

	read() {
		return this._network.request(`${this.PATH}/`);
	}

	update(data) {
		const ids = Object.keys(data);
		return this._network.request(`${this.PATH}/${ids.join(',')}`, data, 'PATCH');
	}

	delete(ids) {
		return this._network.request(`${this.PATH}/${ids.join(',')}`, undefined, 'DELETE');
	}
}