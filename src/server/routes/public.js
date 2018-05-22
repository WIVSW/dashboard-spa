const BaseRoute = require('./base');



class PublicRoute extends BaseRoute {
	constructor(deps) {
		const path = '/';
		const { router } = deps;

		super({path, router});
	}

	_setupRoute() {
		this._router.get(this.PATH, (req, res) => {
			res.send('Hello World');
		});
	}
}

module.exports = PublicRoute;
