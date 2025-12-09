import User from '../model/user-schema.js';

export async function signUpMiddleware(req, res, next){
  try {
    const { username, password } = req.body;

    if (!username || !password ) {
      return res.status(400).json({message: 'fill up the blanks'})
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser){
      return res.status(400).json({ message: 'Username Already Exist'});
    }

    if (password.length < 5){
      return res.status(400).json({ message: 'Password must be atleast 5 characters'});
    }

    next();

  } catch (error){
     console.error('Error in validate Sign Up', error);
    return res.status(500).json({ message: 'Internal Server Error in Sign up middleware'});
  }
}