const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const uploadController = require('./controllers/uploadController');

const app = express();

// Suppress console warnings in dev (optional)
if (process.env.NODE_ENV === "development") {
  const suppressedWarnings = ["Failed to parse source map"];
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && suppressedWarnings.some(w => args[0].includes(w))) {
      return;
    }
    originalWarn(...args);
  };
}

// Connect to MongoDB (new way without callback)
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB();

// Middleware & routes
app.use('/images', express.static('public/images'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authController);
app.use('/user', userController);
app.use('/post', postController);
app.use('/comment', commentController);
app.use('/upload', uploadController);

// Start server
app.listen(process.env.PORT, () => {
  console.log('Server is connected successfully');
});
