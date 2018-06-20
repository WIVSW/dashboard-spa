import React, { PureComponent } from 'react';

import Authentication from '../../blocks/authentication/authentication.jsx';


export default class extends PureComponent {
	render() {
		return <Authentication userApi={this.props.userApi} onAuth={this._onAuth.bind(this)}/>;
	}

	_onAuth() {
		const canGoBack = this.props.history.location.key;
		if (canGoBack) {
			this.props.history.goBack();
		} else {
			this.props.history.push('/');
		}
	}
};
