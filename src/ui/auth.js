import React, {PureComponent} from 'react';
import { Redirect } from 'react-router-dom';



class Auth extends PureComponent {
	constructor(props) {
		super(props);

		this._userApi = props.userApi;
		this.state = {
			isAuth: this._userApi.isAuth()
		};

		this._onLogOutBound = this._onLogOut.bind(this);
	}

	componentWillMount() {
		this._userApi.on(this._userApi.EVENT_LOG_OUT, this._onLogOutBound);
	}

	render() {
		return this.state.isAuth ?
			this.props.component :
			<Redirect to="/login/" />;
	}

	componentWillUnmount() {
		this._userApi.removeListener(this._userApi.EVENT_LOG_OUT, this._onLogOutBound);
	}

	_onLogOut() {
		this.setState({ isAuth: false });
	}
}

export default Auth;
