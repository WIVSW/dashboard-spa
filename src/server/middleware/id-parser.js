const { ObjectID } = require('mongodb');



const idParser = (req, res, next) => {
	const ids = req.params.id.split(',');
	req.params.id = ids.filter((id) => {
		return ObjectID.isValid(id);
	});
	if (!req.params.id.length) {
		return res
			.status(403)
			.send();
	}
	next();
};

module.exports = idParser;
