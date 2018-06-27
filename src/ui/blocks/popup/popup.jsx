import React, {PureComponent} from 'react';

import './popup.scss';


class Popup extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.isVisible = this.props.isVisible;
	}

	componentWillReceiveProps(props) {
		this.setState({ isVisible: props.isVisible })
	}

	render() {
		return (
			<div className={`popup ${this.state.isVisible ? 'popup_visible' : ''}`}>
				<div className="popup__content">

				</div>
			</div>
		)
	}
};


export default Popup;
