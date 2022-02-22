const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// CREATE POST
router.post('/', async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET POST
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(200).json('존재하지 않는 게시물입니다.');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET TIMELINE POSTS
router.get('/timeline/:id', async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.id);
		console.log(currentUser);
		// 유저의 게시물 전부 불러오기
		const userPosts = await Post.find({ userId: currentUser._id });
		console.log(userPosts);
		// 유저 친구들의 게시물 전부 불러오기
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		console.log(friendPosts);
		// 유저의 게시물과 친구들의 게시물을 합해서 반환하기
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
