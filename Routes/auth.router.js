const express =require('express')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()
const { User } = require('../models/userModel')
require('dotenv').config()

authRouter.post('/api/auth/register', async (req, resp) => {
  try {
    const { name, email, mobileNo, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resp.status(400).send({ msg: 'Email ID already in use' });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const createdUser = await User.create({
      name,
      email,
      mobileNo,
      password: hashedPassword,
    });
    return resp.status(201).send({ msg: 'User created successfully', user:createdUser });
  } catch (error) {
    return resp.status(500).send({ msg: 'Internal Server Error' });
  }
});


authRouter.post('/api/auth/login', async (req, resp) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(404).send({ msg: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return resp.status(400).send({ msg: 'Invalid credentials' });
    }

    let token = jwt.sign({email:user.email},process.env.SECUREKEY)
    const { password: _, ...safeUser } = user._doc; 
    return resp.status(200).send({ msg: 'Login successful', user: safeUser, token:token });
  } catch (error) {
    return resp.status(500).send({ msg: 'Internal Server Error' });
  }
});


module.exports = authRouter ;