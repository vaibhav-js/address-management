import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Settings = () => {
    const [sidebarOpen, setSideBarOpen] = useState(true);

    const handleSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    }
    return(
        <div>
            <Navbar />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleSidebar}/>
            <h2>Welcome to Settings</h2>
        </div>
    );
}

export default Settings;