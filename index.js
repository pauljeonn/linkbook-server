const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected to MongoDB.'))
	.catch((err) => console.log(err));

// Middleware
app.use(express.json()); // request body parsing 용도

app.listen(4000, () => {
	console.log('Backend server is running.');
});
