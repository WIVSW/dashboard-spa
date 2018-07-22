import React from 'react';
import Page from '../base';



class Home extends Page {
	preload() {
		return Promise.resolve({ data: {} })
	}

	getTemplate() {
		return (
			<div style={{padding: '30px'}}>
				<p>Someday this page will contain some very important information but not today.</p>
				<p>So please check the other pages.</p>
			</div>
		)
	}
}

export default Home;
