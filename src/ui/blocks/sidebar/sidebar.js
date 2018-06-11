import React, { PureComponent } from 'react';

import Template from './sidebar.jsx';



export default class extends PureComponent {
	constructor() {
		super();
		this.template = <Template/>;
	}

	render() {
		return this.template;
	}
};
