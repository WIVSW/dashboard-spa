import React, {PureComponent} from 'react';

import './button.scss';


class Button extends PureComponent {
	constructor(props) {
		super(props);

		this.state.status = this.props.status || Button.Status.VALID;
	}
}

Button.Status = {
	INVALID: 0,
	VALID: 1,
	WAITING: 2
};


Button.Classes = {
	'0': 'form__btn_disabled',
	'1': '',
	'2': 'icon-spin form__btn_loading'
};

export default Button;