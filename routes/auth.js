const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
	try {
		// bcrypt 라이브러리를 통해 해시된 패스워드 생성
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		console.log(newUser);

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// LOGIN
router.post('/login', async (req, res) => {
	try {
		// 이메일로 유저 검색
		const user = await User.findOne({ email: req.body.email });
		!user && res.status(400).send('해당 이메일을 가진 유저가 없습니다.');

		// 유저가 입력한 비밀번호와 해시된 패스워드 비교
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		!validPassword && res.status(400).send('잘못된 비밀번호입니다.');

		// 비밀번호 제거
		user.password = undefined;

		if (user) {
			// JWT access token 생성
			const accessToken = jwt.sign(
				{ id: user.id, isAdmin: user.isAdmin },
				process.env.JWT_SECRET_KEY,
				{ expiresIn: 3600 } // 1시간 후 만기
			);
			console.log(accessToken);
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
