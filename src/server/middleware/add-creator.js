const addCreator = (req, res, next) => {
	if (!req.user) {
		res
			.status(401)
			.send({ message: "Unauthorized", data: null })
	}

	const id = req.user._id;

	if (Array.isArray(req.body)) {
		req.body.forEach(item => item._creator = id);
	} else {
		req.body._creator = id;
	}

	next();
};

module.exports = addCreator;
