import swal from 'sweetalert';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import '../styles/Form.css'

const Signup = () => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    const navigateToLogin = () => {
        navigate('/');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
      const data = {
        "name": name.trim(),
        "username": username.trim(),
        "password": password.trim()
      };
      
      try {
        const response = await axios.post('http://localhost:8080/signup', data);
          if (response.data.pass === 'true') {            
            await swal("Signup successful!", "You will be redirected to Login", "success");   
            navigate('/');
          } else {
            await swal("Signup unsuccessful!", response.data.error, "warning");
          }
        }
        catch(error) {
          console.error(error);
        };
    };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form className="login-form" onSubmit={handleLogin}>
      <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="name"
            id="name"
            placeholder='Enter name..'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            placeholder='Enter username..'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group-password">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder='Enter password..'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button className='btn-eye-slash' onClick={togglePasswordVisibility}>{showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</button>

        </div>

        <button type="submit" className="btn-login">Register</button>
      </form>
      <button type="submit" className='btn-signup' onClick={navigateToLogin}>Already have an account? Login</button>
    </div>
  );
  }

  export default Signup;