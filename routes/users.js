const router = require('express').Router();
const User = require('../models/User');

// GET USER
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
