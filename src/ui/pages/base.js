import React, { PureComponent } from 'react';



class Page extends PureComponent {
	constructor(props) {
		super(props);

		this._isLoaded = false;
	}

	preload() {
		return Promise.resolve({});
	}

	componentWillMount() {
		this._isLoaded = false;
		this
			.preload()
			.then((data) => {
				this._isLoaded = true;
				this._saveState(data);
			});
	}

	render() {
		return !this._isLoaded ?
			(
				<div style={{display: 'block', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
					Loading...
				</div>
			) :
			this.getTemplate();
	}

	_saveState(data) {
		this.setState(data);
	}
}


export default Page;
