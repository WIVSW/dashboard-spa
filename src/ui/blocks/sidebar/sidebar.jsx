import React from 'react';

import Navigation from '../navigation/navigation.jsx';
import './sidebar.scss';


export default (props) => {
	return (
		<div className="sidebar layout__column">
			<Navigation/>
		</div>
	)
};