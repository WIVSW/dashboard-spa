import React from 'react';
import {Link} from 'react-router-dom';
import 'font-awesome/scss/font-awesome.scss';

export default (props) => {
	return (
		<Link to={props.url} className={`navigation__link fa ${props.icon}`}>{props.name}</Link>
	)
};