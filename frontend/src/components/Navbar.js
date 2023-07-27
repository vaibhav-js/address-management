import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Navbar.scss'

const Navbar = () => {
    const navigate = useNavigate();
    const logout = () => {
      localStorage.removeItem('token');
      navigate('/');
    }
    return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">Dashboard</span>
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search" />
        <button className="btn-search">Search</button>
      </div>
      <div className="navbar-actions">
      <button type="submit" className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
    )
}

export default Navbar