import React, { PureComponent } from 'react';

import Sidebar from './blocks/sidebar/sidebar';



export default class extends PureComponent {
	render() {
		return (
			<div className="wrap">
				<Sidebar/>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}
