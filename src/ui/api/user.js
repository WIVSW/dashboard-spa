import Api from './base';



class User extends Api {
	constructor(deps) {
		const path = '/users';
		 super({
			 network: deps.network,
			 path
		 });
	}

	isAuth() {
		return this._network.isAuth;
	}

	getUserInfo() {
		return this._network.request(`${this.PATH}/me`);
	}


	login(data) {
		return this._network.request(`${this.PATH}/login`, data, 'POST', undefined, true);
	}

	logout() {
		return this._network
			.request(`${this.PATH}/me/token`, undefined, 'DELETE')
			.then(() => this._network.removeToken());
	}

	signup(data) {
		return this._network.request(this.PATH, data, 'POST', undefined, true);
	}
}

export default User;