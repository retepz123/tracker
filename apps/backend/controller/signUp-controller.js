import User from '../model/user-schema.js';

export async function signUp(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.create({
      username,
      password,
    });

    return res.status(200).json({ message: 'Successfully Created', 
      user: {
        username: user.username,
        password: user.password,
      },
    });

  } catch (err){
     console.error('Error fetching the user', err);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
}