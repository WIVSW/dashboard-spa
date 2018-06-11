import React, { PureComponent } from 'react';

import Sidebar from './blocks/sidebar/sidebar';



export default class extends PureComponent {
	render() {
		console.log(this.props);
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
