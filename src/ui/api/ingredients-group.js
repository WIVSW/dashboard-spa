import Rest from './rest';


class IngredientsGroup extends Rest {
	constructor(deps) {
		super({
			path: '/ingredients-groups',
			network: deps.network
		})
	}

	update(data) {
		throw new Error('Can\'t update ingredients group');
	}
}

export default IngredientsGroup;
