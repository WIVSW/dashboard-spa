import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './base.scss';
import Router from './router.jsx';


const App = (props) => (
	<BrowserRouter>
		<Router {...props} />
	</BrowserRouter>
);


ReactDOM.render(<App isAuth={true}/>, document.getElementById('root'));