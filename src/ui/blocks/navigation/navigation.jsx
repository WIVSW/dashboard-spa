import React from 'react';

import Link from './__link/navigation__link.jsx';

import './navigation.scss';

import navigation from './navigation.json';


export default (props) => {
	const links = navigation.map((link, i) => <Link key={i} {...link} />);
	return (
		<div className="navigation">
			{links}
		</div>
	)
};