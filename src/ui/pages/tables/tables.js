import React, { PureComponent } from 'react';
import TableFilterable from '../../blocks/table-filterable/table-filterable.jsx';



export default class extends PureComponent {
	render() {
		this.props.ingredientsGroupApi
			.read()
			.then((data) => console.log(data));
		const filters = [
			{
				id: 123,
				name: 'Дочка молочника'
			},
			{
				id: 23,
				name: 'Кубинская плантация'
			}
		];

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
					Цена: 123,
					supplier: 123
				},
				{
					Название: 'Горячий шоколад',
					Описание: 'Очень вкусный напиток',
					Цена: 666.06,
					supplier: 23
				}
			]
		};
		return <TableFilterable filters={filters} table={table}/>;
	}
}
