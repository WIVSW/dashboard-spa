import React, { PureComponent } from 'react';

import Sidebar from '../sidebar/sidebar';
import './layout.scss'


export default class extends PureComponent {
	render() {
		return (
			<div className="wrap">
				{ this._getSidebar() }
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}

	_getSidebar() {
		if (!this.props.showSidebar)
			return null;

		return <Sidebar/>;
	}
};
