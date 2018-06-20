import Network from './network';

import User from './api/user';



class Application {
	constructor() {
		this._network = new Network();

		this.api = {};

		this._bindApis();
	}

	_bindApis() {
		const { api } = this;
		api.user = new User({
			network: this._network
		});
	}

}

export default Application;