import Rest from './rest';


class Product extends Rest {
	constructor(deps) {
		super({
			path: '/products',
			network: deps.network
		})
	}
}

export default Product;
