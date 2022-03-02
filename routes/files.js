const router = require('express').Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// AWS 설정
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: 'ap-northeast-2',
});

// 업로드 모듈
const upload = multer({
	storage: multerS3({
		s3: new aws.S3(),
		bucket: 'linkbook',
		key(req, file, cb) {
			cb(null, Date.now() + file.originalname);
		},
	}),
	limits: { fileSize: 1024 * 1024 }, // 파일 용량 제한 (1MB)
});

// UPLOAD FILE
router.post('/upload', upload.single('file'), async (req, res) => {
	try {
		let imgURL = { url: req.file.location };
		return res.status(200).json(imgURL);
	} catch (err) {
		return res.status(500).json(err);
	}
});

module.exports = router;
