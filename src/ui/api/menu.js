import Rest from './rest';


class Menu extends Rest {
	constructor(deps) {
		super({
			path: '/menus',
			network: deps.network
		})
	}
}

export default Menu;
