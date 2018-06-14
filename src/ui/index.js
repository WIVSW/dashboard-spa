import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './base.scss';
import './fonts/fontello/fontello.scss';
import './fonts/SourceSansPro/SourceSansPro.scss'
import Router from './router.jsx';


const App = (props) => (
	<BrowserRouter>
		<Router {...props} />
	</BrowserRouter>
);


ReactDOM.render(<App isAuth={false}/>, document.getElementById('root'));