import React, { PureComponent } from 'react';



export default class extends PureComponent {
	render() {
		return (
			<div>
				Menu {this.props.match.params.id}
			</div>
		);
	}
}
