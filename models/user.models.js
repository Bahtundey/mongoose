

const mongoose = require('mongoose');




const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'firstname is required'],
    match: [/^[A-Za-z]+$/, 'Please enter a valid firstname'],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, 'lastname is required'],
    match: [/^[A-Za-z]+$/, 'Please enter a valid lastname'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email already exists'],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'], 
    trim: true,
  },
});

// const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
