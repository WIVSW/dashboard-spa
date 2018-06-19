import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Form from '../form/form.jsx';

import './authentication.scss';
import LoginForm from './login-form.json';
import SignUpForm from './signup-form.json';



export default class extends PureComponent {
	constructor(props) {
		super(props);

		this._userApi = this.props.userApi;
	}

	render() {
		console.log(this.props);
		return (
			<div className="auth">
				<Tabs className='auth__tabs' selectedTabClassName='auth__tab_selected' selectedTabPanelClassName='auth__tab-panel_selected'>
					<TabList className='auth__tabs-list'>
						<Tab className='auth__tab'>Log in</Tab>
						<Tab className='auth__tab'>Sign up</Tab>
					</TabList>
					<TabPanel className='auth__tab-panel'>
						<Form onSubmit={this._onLogin.bind(this)} form={LoginForm}/>
					</TabPanel>
					<TabPanel className='auth__tab-panel'>
						<Form onSubmit={this._onSignUp.bind(this)} form={SignUpForm}/>
					</TabPanel>
				</Tabs>
			</div>
		);
	}

	_onLogin(e) {
		console.log('LOGIN', e);
	}

	_onSignUp(e) {
		console.log('SIGN UP', e);
	}
};
