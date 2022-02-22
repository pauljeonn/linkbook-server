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
		// 유저의 게시물 전부 불러오기
		const userPosts = await Post.find({ userId: currentUser._id });
		// 유저 친구들의 게시물 전부 불러오기
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		// 유저의 게시물과 친구들의 게시물을 합해서 반환하기
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE POST
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json('게시물이 삭제되었습니다.');
		} else {
			res.status(200).json('본인이 작성한 게시물만 삭제 가능합니다.');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// LIKE POST
router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('해당 게시물에 좋아요를 보냈습니다.');
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('해당 게시물에 좋아요를 취소했습니다.');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
