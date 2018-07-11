import React from 'react';
import Page from '../base';


class ProductTotal extends Page {
	getTemplate() {
		return (<div>Product Total {this.props.match.params.id}</div>);
	}
}


export default ProductTotal;
