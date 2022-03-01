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

// FOLLOW USER
router.put('/:id/follow', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const targetUser = await User.findById(req.body.userId);
		if (!user.following.includes(req.body.userId)) {
			await user.updateOne({ $push: { following: req.body.userId } });
			await targetUser.updateOne({ $push: { followers: req.params.id } });
			res.status(200).json(user);
		} else {
			res.status(403).json('이미 팔로잉하는 유저입니다.');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// UNFOLLOW USER
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const targetUser = await User.findById(req.body.userId);
			if (user.following.includes(req.body.userId)) {
				await user.updateOne({ $pull: { following: req.body.userId } });
				await targetUser.updateOne({ $pull: { followers: req.params.id } });
				res.status(200).json(user);
			} else {
				res.status(403).json('팔로우하지 않은 유저입니다.');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	}
});

module.exports = router;
