import React from 'react';
import Page from '../base';


class ProductTotal extends Page {
	preload() {
		const { id } = this.props.match.params;
		return this.props.productCalculator.getProductTotalById(id);
	}
	
	getTemplate() {
		console.log(this.state);
		return (<div>Product Total {this.props.match.params.id}</div>);
	}
}


export default ProductTotal;
