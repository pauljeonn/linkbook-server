const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');

dotenv.config();

const app = express();
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected to MongoDB.'))
	.catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json()); // request body parsing 용도

const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', upload.single('file'), async (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully.');
	} catch (err) {
		console.log(err);
	}
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

app.listen(4000, () => {
	console.log('Backend server is running.');
});
