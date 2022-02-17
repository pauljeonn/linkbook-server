const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');

dotenv.config();

const app = express();
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected to MongoDB.'))
	.catch((err) => console.log(err));

// Middleware
app.use(express.json()); // request body parsing 용도

// Routes
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

app.listen(4000, () => {
	console.log('Backend server is running.');
});
