import User from '../model/user-schema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JSONWEB =  process.env.SECRET_KEY;

export async function login(req, res){
  try {
    const user = req.user;
    console.log('request user', req.user);

    if (!user){
      return res.status(400).json({ message: 'User unavailable'});
    }

    const token = jwt.sign({
      id: user._id,
      username: user.username},
      process.env.SECRET_KEY,
      { expiresIn: '7d'}
    );

    //  console.log("Token received:", token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: `Welcome ${user.username}`,
    token,
    user: {
      _id: user._id,
    },
    });

  } catch (error){
    console.error('Error fetching the data', error);
    return res.status(500).json({ message: 'Internal server Error'});
  }
}