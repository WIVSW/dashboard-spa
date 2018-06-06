import React, { PureComponent } from 'react';

import Template from './sidebar.jsx';



export default class extends PureComponent {
	constructor() {
		super();
		this.template = <Template/>;
	}

	componentWillMount() {
		console.log('Mount');
	}

	render() {
		return this.template;
	}
};
