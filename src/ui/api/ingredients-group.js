import Rest from './rest';
import IngredientGroupModel from "../models/ingredients-group";


class IngredientsGroup extends Rest {
	constructor(deps) {
		super({
			path: '/ingredients-groups',
			network: deps.network,
			model: IngredientGroupModel
		})
	}

	update(data) {
		throw new Error('Can\'t update ingredients group');
	}
}

export default IngredientsGroup;
