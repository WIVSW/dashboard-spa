import React, { PureComponent } from 'react';

import './form.scss';


class Form extends PureComponent {
	constructor(props) {
		super();

		this.props = props;
		this.state = props.form;
		this.state.status = undefined;
		this.state.errors = [];
	}

	render() {
		return (
			<form className="form form_clearfix" onSubmit={this._onSubmit.bind(this)}>
				<div className="form__error">
					{
						this.state.errors.map(
							(message, i) => (
								message.length ?
									<p key={i} className="form__error-message">{message}</p> :
									null
							)
						)
					}
				</div>
				{
					this.state.inputs.map(
						(input, i) => <input
							key={i}
							className='form__input'
							type={input.type}
							placeholder={input.placeholder}
							autoComplete='off'

							onChange={(e) => this._onInputChange(e, i)}
							onBlur={(e) => this._onInputChange(e, i)}
						/>
					)
				}
				<button
					type='submit'
					className={`form__btn ${Form.BtnClasses[this.state.status]}`}
				>
					{this.state.action}
				</button>
			</form>
		);
	}

	_onSubmit(e) {
		e.preventDefault();

		this.state.inputs.forEach((input) => this._validateInput(input));
		this._updateFormStatus();

		if (!this._canSubmit())
			return;

		this.props.onSubmit(e);
	}

	_canSubmit() {
		return this.state.status === Form.Status.VALID
	}

	_onInputChange(e, i) {
		const { value } = e.target;
		const elem = this.state.inputs[i];

		elem.value = value;
		this._validateInput(elem);
		this._updateFormStatus();
	}

	_validateInput(input) {
		const { pattern, equals } = input.validation;

		if (input.validation.required) {
			if (pattern && pattern.length) {
				const reqExp = new RegExp(...pattern);
				input.valid = reqExp.test(input.value);
				input.message = input.valid ? '' : input.error;
			}

			if (typeof equals === 'number') {
				const targetInput = this.state.inputs[equals];
				input.valid = targetInput.value === input.value;
				input.message = input.valid ? '' : input.error;
			}
		} else {
			input.valid = true;
			input.message = '';
		}

	}

	_updateFormStatus() {
		const { INVALID, VALID } = Form.Status;
		const valid = this.state.inputs.reduce((prev, curr) => prev && curr.valid, true);
		const errors = this.state.inputs
			.map((input) => input.message)
			.filter((message) => message.length);
		this.setState({ status: valid ? VALID : INVALID, errors });
	}
}


Form.Status = {
	INVALID: 0,
	VALID: 1,
	WAITING: 2
};


Form.BtnClasses = {
	'0': 'form__btn_disabled',
	'1': '',
	'2': 'form__btn_loading'
};


export default Form;
