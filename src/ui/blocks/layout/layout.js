import React, { PureComponent } from 'react';

import Sidebar from '../sidebar/sidebar.jsx';
import './layout.scss'


export default class extends PureComponent {
	render() {
		return (
			<div className="layout">
				{ this._getSidebar() }
				<div className="main layout__column">
					<div className="main__content">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}

	_getSidebar() {
		if (!this.props.userApi.isAuth())
			return null;

		return <Sidebar/>;
	}
};
