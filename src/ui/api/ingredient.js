import Rest from './rest';
import IngredientModel from '../models/ingredient';


class Ingredient extends Rest {
	constructor(deps) {
		super({
			path: '/ingredients',
			network: deps.network,
			model: IngredientModel
		})
	}
}

export default Ingredient;
