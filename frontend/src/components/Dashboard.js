import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate a delay to show the loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  }
    return (
      <div>
        {loading ? (
        <LoadingSpinner/>
        ) : <>
        <div>
          <Navbar />
          <Sidebar isOpen={sideBarOpen} toggleSidebar={handleSideBar}/>
          </div>
          </>
      }
      </div>
    );
  };
  export default Dashboard;