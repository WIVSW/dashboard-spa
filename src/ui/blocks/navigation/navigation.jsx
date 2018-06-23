import React, {Component} from 'react';

import Link from './__link/navigation__link.jsx';

import './navigation.scss';

import navigation from './navigation.json';



export default class extends Component {
	constructor(props) {
		super(props);

		this._userApi = props.userApi;
		this._links = navigation.map((link, i) => <Link key={i} {...link} />);
	}

	render() {
		return (
			<div className="navigation">
				{this._links}
				<button className="navigation__btn" onClick={this._onLogOut.bind(this)}>Log Out</button>
			</div>
		);
	}

	_onLogOut(e) {
		this._userApi.logout();
	}
};
