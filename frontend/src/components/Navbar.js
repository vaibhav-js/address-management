import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Navbar.scss'
import swal from "sweetalert";

const Navbar = (props) => {

    const [accessible, setAccessible] = useState('');
    const [accessibleValue, setAccessibleValue] = useState('');
    const navigate = useNavigate();

    if (props.isOpen) {
      props.updateAccessibles();
    }

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

    const addAccessible = async (e) => {
      try {
        const data = {
          "accessible": accessible.trim(), 
          "accessibleValue": accessibleValue.trim(), 
          token: localStorage.getItem('token')
        }
      const response = await axios.post('http://localhost:8080/addaccessible', data);
      if (response.data.newAccessible) {
        props.updateAccessibles(response.data.newAccessible);
      } else {
        await swal("Oops :(", response.data.error, "error");
      }
      } catch (error) {
        console.error('Error adding accessible', error);
      }
    }

    return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">Hi {localStorage.getItem('name')}</span>
      </div>
      <div className="navbar-search">
        <input 
        type="text" 
        placeholder="Enter accessible" 
        onChange={(e) => setAccessible(e.target.value)}
        />
        <input 
        type="text" 
        placeholder="Enter Value" 
        onChange={(e) => setAccessibleValue(e.target.value)}
        />
        <button className="btn-search" onClick={addAccessible}>Submit</button>
      </div>
      <div className="navbar-actions">
      <button type="submit" className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
    )
}

export default Navbar