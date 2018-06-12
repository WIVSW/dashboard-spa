import React from 'react';
import {Link} from 'react-router-dom';

export default (props) => {
	return (
		<Link to={props.url} className={`navigation__link fa ${props.icon}`}>{props.name}</Link>
	)
};