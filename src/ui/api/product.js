import Rest from './rest';
import ProductModel from "../models/product";


class Product extends Rest {
	constructor(deps) {
		super({
			path: '/products',
			network: deps.network,
			model: ProductModel
		})
	}
}

export default Product;
