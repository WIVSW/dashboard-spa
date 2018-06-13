import React, {PureComponent} from 'react';

import './filter.scss';

export default class extends PureComponent {
	constructor(props) {
		super(props);

		this.DEFAULT_ACTIVE_ID = -1;

		this.state = this._getInitialState(props.filters);
		this._onFilterSelected = props.onFilterSelected;
	}

	render() {
		return (
			<div className="filters">
				{
					this.state.filters.map(
						(item, i) =>
							<button
								key={i}
								onClick={() => this._onClick(item.id)}
								className={`filters__item ${item.id === this.state.activeId ? 'filters__item_selected' : ''}`}
							>
								{item.name}
							</button>
					)
				}
			</div>
		);
	}

	_onClick(activeId) {
		this._onFilterSelected(activeId);
		this.setState({activeId});
	}

	_getDefaultFilters() {
		return [
			{
				id: this.DEFAULT_ACTIVE_ID,
				name: 'All'
			}
		]
	}

	_getInitialState(filtersProp) {
		const activeId = this.DEFAULT_ACTIVE_ID;
		const filters = this._getDefaultFilters().concat(filtersProp);
		return { activeId, filters };
	}

};