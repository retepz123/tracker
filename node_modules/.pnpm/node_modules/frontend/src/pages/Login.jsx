import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios'
import '../styleCss/login.css';

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
    
      if (error.response?.data?.message) {
    alert(error.response.data.message);
  } else {
    alert('Something went wrong. Please try again.');
  }
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
    <div className='login-container'>
      <div className='login-form'>
          <h1>Login</h1>
      <div>
        <form className='form' onSubmit={handleSubmit}>
          <input className='login-input' onChange={handleChange} value={form.username} type='text' placeholder='Username' name='username' />
          <input className='login-input' onChange={handleChange} value={form.password} type='password' placeholder='Password' name='password' />
          <button type='submit'>Login</button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Login;