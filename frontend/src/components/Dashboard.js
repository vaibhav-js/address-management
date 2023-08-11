import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const Dashboard = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessibles, setAccessibles] = useState([]);

  // Simulate a delay to show the loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


    const updateAccessibles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getaccessible', {params: {token: localStorage.getItem('token')}});
        setAccessibles(response.data)
      } catch (error) {
        console.error('Error while getting accessible', error);
      }
    };

  const handleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  }

    return (
      <div>
        {loading ? (
        <LoadingSpinner/>
        ) : <>
        <div>
          <Navbar isOpen={sideBarOpen} updateAccessibles={updateAccessibles}/>
          <Sidebar accessibles={accessibles} isOpen={sideBarOpen} toggleSidebar={handleSideBar}/>
          </div>
          </>
      }
      </div>
    );
  };
  export default Dashboard;