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

// GET FRIENDS
router.get('/friends/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		// 친구 목록 생성해서 반환
		const friends = await Promise.all(
			user.following.map((friendId) => {
				return User.findById(friendId);
			})
		);
		res.status(200).json(friends);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET RECOMMENDED FRIENDS
router.get('/recommended', async (req, res) => {
	console.log('GET RECOMMENDED');

	try {
		const all = await User.find({}).exec();

		res.status(200).json(all);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
