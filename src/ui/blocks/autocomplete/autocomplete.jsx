import React, { PureComponent } from 'react';

import Button from '../../blocks/button/button.jsx';

import './autocomplete.scss';

class Autocomplete extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.found = [];
		this.state.value = '';
		this.state.activeItem = null;
		this.state.btnStatus = Button.Status.DISABLED;
	}

	render() {
		return (
			<form
				className={`form autocomplete ${ this.state.found.length ? 'autocomplete_found' : ''}`}
				onSubmit={(e) => this._onSubmit(e, this.state.activeItem)}
			>
				<input
					className={'form__input'}
					type="text"
					autoComplete={'off'}
					onChange={(e) => this._onInput(e)}
					value={this.state.value}
				/>
				<Button type={'submit'} className={'autocomplete__btn'} status={this.state.btnStatus}>Add</Button>
				<div className={'autocomplete__result'}>
					{this.state.found.map((item, i) => (
						<p key={i} className="autocomplete__result-item" onClick={() => this._onPick(item)}>{item.name}</p>
					))}
				</div>
			</form>
		);
	}

	_onInput(e) {
		const activeItem = null;
		const btnStatus = Button.Status.DISABLED;
		const { value } = e.target;
		const found = value.length ?
			this.props.source
				.filter((product) => product.name.toLowerCase().includes(value.toLowerCase())) :
			[];

		this.setState({ found, value, activeItem, btnStatus });
	}

	_onPick(item) {
		const found = [];
		const value = item.name;
		const activeItem = item;
		const btnStatus = Button.Status.ACTIVE;

		this.setState({ found, value, activeItem, btnStatus });
	}

	_onSubmit(e, item) {
		e.preventDefault();
		if (!item)
			return Promise.resolve();

		return this.props
			.onAdd(item)
			.then(() => {
				const found = [];
				const value = '';
				const activeItem = null;
				const btnStatus = Button.Status.DISABLED;

				this.setState({ found, value, activeItem, btnStatus });

				return Promise.resolve();
			});
	}
}

export default Autocomplete;
