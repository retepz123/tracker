import { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styleCss/signUp.css';
import location from '../assets/location.gif';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

function SignUp() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  function handleChange(e){
    setForm({...form, [e.target.name]: e.target.value});
  };

  async function handleSubmit(e){
    e.preventDefault();

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password){
      alert('Please fill the blanks');
      return;
    }
    console.log("Sending request to:", import.meta.env.VITE_BACKEND_URL + '/api/auth/signUp');

    try {
      const res = await axiosInstance.post('/api/auth/signUp', form);
      alert('Successfully Created');

       setTimeout(() => navigate('/login'), 1000);

    } catch (error){
        if (error.response && error.response.data.error) {
    alert(error.response.data.error); 
  } else if (error.response && error.response.data.message) {
    alert(error.response.data.message); 
  } else {
    console.error('Error in signup', error);
    alert('Internal Server Error');
      }

    }

  }

  return (  
    <div className='sign-container'>
      <div className='tag-logo'>
        <img src={location} className='location-marker' alt='logo' />
        <p className='tagline'>Track users live, anywhere on the map</p>
      </div>
       <div className='form-container'>
          <h1 className='sign-up'>Sign Up</h1>
      <form className='sign-form' onSubmit={handleSubmit}>
        <input className='sign-input' onChange={handleChange} value={form.username} type='text' placeholder='Username' name='username' />
        <input className='sign-input' onChange={handleChange} value={form.password} type='password' placeholder='Password' name='password' />
        <button className='sign-btn' type='submit'>Submit</button>
      </form>
      <Link to='/login'>Login</Link>
       </div>
    </div>
  );
}

export default SignUp;