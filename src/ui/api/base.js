class Api {
	constructor(deps) {
		this.PATH = `/api${deps.path}`;

		this._network = deps.network;
	}
}

export default Api;