import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './base.scss';
import Router from './router.jsx';


const App = () => (
	<BrowserRouter>
		<Router/>
	</BrowserRouter>
);


ReactDOM.render(<App/>, document.getElementById('root'));