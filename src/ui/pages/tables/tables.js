import React, { PureComponent } from 'react';
import Table from '../../blocks/table/table.jsx';



export default class extends PureComponent {
	render() {
		const table = {
			head: [
				'Название',
				'Описание',
				'Цена'
			],
			body: [
				{
					Название: 'Cырный раф',
					Описание: 'Очень вкусный напиток',
					Цена: 123
				},
				{
					Название: 'Горячий шоколад',
					Описание: 'Очень вкусный напиток',
					Цена: 666.06
				}
			]
		};
		return (
			<Table table={table}/>
		);
	}
}
