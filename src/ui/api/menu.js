import Rest from './rest';
import MenuModel from "../models/menu";


class Menu extends Rest {
	constructor(deps) {
		super({
			path: '/menus',
			network: deps.network,
			model: MenuModel
		})
	}
}

export default Menu;
