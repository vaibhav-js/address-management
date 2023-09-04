import swal from 'sweetalert';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Form.scss'


const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [disableLoginButton, setDisableLoginButton] = useState(false);
    const navigate = useNavigate();


    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    const navigateToSignup = () => {
        navigate('/signup')
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setDisableLoginButton(true);
      const data = {
        "username": username,
        "password": password
      };
      
      try {
        const response = await axios.post('http://localhost:8080/login', data);
          if (response.data.pass === 'true') {
            await swal("Login successful!", "You will be redirected to dashboard!", "success");
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.name);
            navigate('/dashboard')
          } else {
            await swal("Login unsuccessful!", "Invalid credentials!", "error");
          }
        }
        catch(error) {
          console.error(error);
        };
        setDisableLoginButton(false);
    };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            value={username}
            placeholder='Enter username..'
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
        
        <button
        type="submit"
        className="btn-login-signup-form"
        disabled={disableLoginButton}
        >
          Login
        </button>
      </form>     
      <button type="submit" className='btn-signup' onClick={navigateToSignup}>Don't have an account? Register</button>
      <center>OR</center>
      <br />
      <GoogleLoginButton />
    </div>
  );
  }

  export default LoginForm;