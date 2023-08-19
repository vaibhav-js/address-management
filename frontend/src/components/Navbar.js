import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Navbar.scss'

const Navbar = () => {

    const navigate = useNavigate();

    const logout = async () => {
      try {
        const response = await axios.post('http://localhost:8080/logout', {token: localStorage.getItem('token')});
        if (response.data.success === 'true') {
          localStorage.removeItem('name');
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Error while logout', error);
      }
    }

    return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">Hi {localStorage.getItem('name')}</span>
      </div>
      <div className="navbar-actions">
      <button type="submit" className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
    )
}

export default Navbar;