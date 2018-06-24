import Rest from './rest';


class Ingredient extends Rest {
	constructor(deps) {
		super({
			path: '/ingredients',
			network: deps.network
		})
	}
}

export default Ingredient;
