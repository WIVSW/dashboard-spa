import React, {PureComponent} from 'react';

import './button.scss';


class Button extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.status = typeof props.status === 'number' ? props.status : Button.Status.ACTIVE;
	}

	componentWillReceiveProps(props) {
		if (typeof props.status === 'number')
			this.setState({ status: props.status })
	}

	render() {
		return (
			<button
				type={this.props.type || 'button'}
				className={`btn ${this.props.className} ${Button.Classes[this.state.status]}`}
				onClick={() => this._onClick()}
			>
				{this.props.children || null}
			</button>
		);
	}

	_onClick() {
		if (!this.props.onClick)
			return;

		const { ACTIVE } = Button.Status;

		if (this.state.status !== ACTIVE)
			return;


		this.setState({ status: Button.Classes.WAITING });

		this.props
			.onClick()
			.finally(() => this.setState({ status: ACTIVE }));
	}
}

Button.Status = {
	DISABLED: 0,
	ACTIVE: 1,
	WAITING: 2
};


Button.Classes = {
	'0': 'btn_disabled',
	'1': 'btn_active',
	'2': 'icon-spin btn_loading'
};

export default Button;