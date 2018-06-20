import Model from './user';



class User extends Model {
	constructor(data) {
		super(data);
	}

	_parse(data) {
		this._id = data['_id'];
		this.email = data['email'];
	}
}

export default User;