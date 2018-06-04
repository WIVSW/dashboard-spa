import React, { PureComponent } from 'react';



export default class extends PureComponent {
	render() {
		return (
			<div>
				Table {this.props.match.params.id}
			</div>
		);
	}
}
