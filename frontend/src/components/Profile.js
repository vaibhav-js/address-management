import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Profile = () => {
    const [sideBarOpen, setSideBarOpen] = useState(true);

    const handleSidebar = () => {
        setSideBarOpen(!sideBarOpen);
    }

    return(
        <div>
            <Navbar />
            <Sidebar isOpen={sideBarOpen} toggleSidebar={handleSidebar} />
            <h2>Welcome to Profile</h2>
        </div>
    );
}

export default Profile