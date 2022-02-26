const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const fileRoute = require('./routes/files');

dotenv.config();

const app = express();
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected to MongoDB.'))
	.catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json()); // request body parsing 용도

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/files', fileRoute);

app.listen(4000, () => {
	console.log('Backend server is running.');
});
