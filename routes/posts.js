const router = require('express').Router();
const Post = require('../models/Post');

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

module.exports = router;
