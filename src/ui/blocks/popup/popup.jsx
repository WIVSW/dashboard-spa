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
						<Form form={this.state.form} onSubmit={(data) => this._onSend(data)}/>
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

		form.inputs = keys.map((key) => {
			const placeholder = key.includes('.') ?
				this.props.getCustomKeyProp(key).prop : key;
			return {
				"name": key,
				"export": true,
				"valid": false,
				"placeholder": `Type the ${placeholder.toLowerCase()} here`,
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
			};
		});

		return form;
	}

	_onSend(data) {
		const objToSend = {};

		for(let name in data) {
			if (name.includes('.')) {
				const { key, prop } = this.props.getCustomKeyProp(name);

				if (!(key in objToSend))
					objToSend[key] = {};

				objToSend[key][prop] = data[name];
			} else {
				objToSend[name] = data[name];
			}
		}

		return this.props.onSend(objToSend);
	}
};


export default Popup;
