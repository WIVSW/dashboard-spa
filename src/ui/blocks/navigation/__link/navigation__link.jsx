import React from 'react';
import {NavLink} from 'react-router-dom';

export default (props) => {
	return (
		<NavLink
			to={props.url}
			activeClassName="navigation__link_selected"
			className={`navigation__link fa ${props.icon}`}
			exact={props.exact}
		>
			{props.name}
		</NavLink>
	)
};