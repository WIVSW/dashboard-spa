class PublicRoute {
    constructor(deps) {
        this.PATH = '/';

        this._router = deps.router;

        this._setupRoute();
    }

    _setupRoute() {
        this._router.get('/', (req, res) => {
            res.send('Hello World');
        });
    }
}

module.exports = PublicRoute;
