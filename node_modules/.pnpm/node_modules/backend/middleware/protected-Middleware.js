import jwt from 'jsonwebtoken';
import User from '../model/user-schema.js';

export async function protectedMiddleware(req, res, next){
      console.log('request user', req.user);


try {
 let token;
   console.log('PM TOken:', token);

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
} else if (req.cookies && req.cookies.token) {
  token = req.cookies.token;
} else {
  return res.status(401).json({ message: 'No token provided' });
}


  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
  console.log('Decoded:', decoded);

  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user){
      return res.status(401).json({ message: 'User not found' });
  }

  next();

  } catch (error) {
    console.error('Error in fetching data', error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error in protected Middleware' });
  }
}