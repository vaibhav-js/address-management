import swal from 'sweetalert';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import '../styles/Form.css'


const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
      const data = {
        "username": username,
        "password": password
      };
      
      try {
        const response = await axios.post('http://localhost:8080/login', data);
          console.log(response.data);
          if (response.data === true) {
            await swal("Login successful!", "You will be redirected to dashboard!", "success");
            localStorage.setItem('token', 'valid'); 
            navigate('/dashboard');
          } else {
            await swal("Login unsuccessful!", "Invalid credentials!", "error");
          }
        }
        catch(error) {
          console.error(error);
        };
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
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group-password">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            
          />
          <button className='btn-eye-slash' onClick={togglePasswordVisibility}>{showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</button>
        </div>
        
        <button type="submit" className="btn-login">Login</button>
        <button type="submit" className='btn-signup' onClick={navigateToSignup}>Don't have an account? Register</button>
      </form>     
    </div>
  );
  }

  export default LoginForm;