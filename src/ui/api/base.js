import { EventEmitter } from 'events';



class Api extends EventEmitter {
	constructor(deps) {
		super();

		this.PATH = `/api${deps.path}`;

		this._network = deps.network;
	}
}

export default Api;