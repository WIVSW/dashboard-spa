import React from 'react';
import {Link} from 'react-router-dom';


export default (props) => {
	return (
		<div className="sidebar">
			<div className="navigation">
				<Link to='/' className="navigation__link">Home</Link>
				<Link to='/tables/' className="navigation__link">Tables</Link>
				<Link to='/menus/' className="navigation__link">Menus</Link>
				<Link to='/products/' className="navigation__link">Products</Link>
				<Link to='/login/' className="navigation__link">Login</Link>
			</div>
		</div>
	)
};