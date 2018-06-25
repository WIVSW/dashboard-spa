import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './base.scss';

import './fonts/fontello/fontello.scss';
import './fonts/SourceSansPro/SourceSansPro.scss'
import './fonts/spin/spin.scss';
import './fonts/controls/controls.scss';

import Router from './router.jsx';
import Application from './application';

const app = new Application();

const App = (props) => (
	<BrowserRouter>
		<Router {...props} />
	</BrowserRouter>
);


ReactDOM.render(<App api={app.api}/>, document.getElementById('root'));