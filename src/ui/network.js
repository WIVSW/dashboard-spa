class Network {
	constructor() {
		this.TOKEN = 'token';

		this._token = localStorage[this.TOKEN];
	}

	get isAuth() {
		return !!this._token;
	}

	removeToken() {
		this._token = undefined;
		localStorage.removeItem(this.TOKEN);
	}

	request(url, data, method = 'GET', headers = {}, needUpdateToken) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url);

			if (this._token)
				xhr.setRequestHeader('x-auth', this._token);

			if (data) {
				data = JSON.stringify(data);
				xhr.setRequestHeader('Content-Type', 'application/json');
			}

			for(let key in headers)
				xhr.setRequestHeader(key, headers[key]);

			xhr.onload = () => {
				if (xhr.status === 200) {
					if (needUpdateToken) {
						this._setToken(xhr.getResponseHeader('x-auth'));
					}
					resolve(JSON.parse(xhr.response)['data']);
				}

				reject(JSON.parse(xhr.response)['message']);
			};

			xhr.onerror = error => reject(error);

			data ? xhr.send(data) : xhr.send();
		});
	}

	_setToken(token) {
		this._token = token;
		localStorage[this.TOKEN] = token;
	}
}

export default Network;