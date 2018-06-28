import React, {PureComponent} from 'react';

import Form from '../form/form.jsx';

import './popup.scss';


class Popup extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.title = this.props.title;
		this.state.isVisible = this.props.isVisible;
		this.state.form = this._generateForm(this.props.getKeys());
	}

	componentWillReceiveProps(props) {
		this.setState({ isVisible: props.isVisible })
	}

	render() {
		return (
			<div className={`popup ${this.state.isVisible ? 'popup_visible' : ''}`}>
				<button className="icon-cancel popup__close" onClick={() => this._close()}></button>
				<div className="popup__wrap">
					<div className="popup__content">
						<h3>{this.state.title}</h3>
						<Form form={this.state.form} onSubmit={(data) => this.props.onSend(data)}/>
					</div>
				</div>
			</div>
		)
	}

	_close() {
		this.props.onClose();
	}

	_generateForm(keys) {
		const form = { action: 'Send', inputs: [] };

		form.inputs = keys.map((key) => ({
			"name": key,
			"export": true,
			"valid": false,
			"placeholder": `Type ${key} here`,
			"type": "text",
			"value": "",
			"validation": {
				"required": true,
				"pattern": [
					"[\\S]{1,}",
					"i"
				]
			},
			"message": "",
			"error": `The ${key} can't be empty`
		}));

		return form;
	}
};


export default Popup;
