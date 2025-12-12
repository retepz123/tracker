import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios'

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e){
    e.preventDefault();

    const username = form.username.trim();
    const password = form.password;

    if(!username || !password){
      alert('Sulati ang blangko')
    }

    try {
      const res = await axiosInstance.post('/api/auth/login', {username, password});

      if (res.data?.token){
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        localStorage.setItem('user', JSON.stringify(res.data.user));

        setLoggedIn(true);
        console.log('Succesfully Logged-in');
        alert('Successfully Logged In');

      } else {
        alert('Login failed');
      }

    } catch (error){
      console.error('Error:', error);
      alert('Internal login error');
    }
}

    useEffect(() => {
      if (loggedIn) {
        const timer = setTimeout(() => {
          navigate('/map');
        }, 1000);
        return () => clearTimeout(timer);
      }
  }, [loggedIn, navigate]);



  return (
    <div>
      <h1>Login</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input onChange={handleChange} value={form.username} type='text' placeholder='Username' name='username' />
          <input onChange={handleChange} value={form.password} type='password' placeholder='Password' name='password' />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;