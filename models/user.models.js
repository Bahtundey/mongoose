const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required'],
    match: [/^[A-Za-z\s\-']+$/, 'Please enter a valid firstname'],
    trim: true,
    minlength: [2, 'Firstname must be at least 2 characters long'],
    maxlength: [50, 'Firstname too long'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required'],
    match: [/^[A-Za-z\s\-']+$/, 'Please enter a valid lastname'],
    trim: true,
    minlength: [2, 'Lastname must be at least 2 characters long'],
    maxlength: [50, 'Lastname too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already exists'],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit',
    ],
    trim: true,
  },
});

module.exports = mongoose.model('User', userSchema);
