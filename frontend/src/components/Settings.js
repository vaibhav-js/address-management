import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import swal from "sweetalert";

const Settings = () => {
    const [sidebarOpen, setSideBarOpen] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const data = {
            token: localStorage.getItem('token'),
            oldPassword: oldPassword.trim(),
            newPassword: newPassword.trim()
        };
        if(newPassword.trim() !== confirmNewPassword.trim()) {
            await swal('Error', "New password don't match", "error")
        }
        const response = await axios.put('http://localhost:8080/updatepassword', data);
        if(response.data.success) {
            await swal('Success', response.data.message, 'success');
        } else {
            await swal('Error', response.data.message, 'error');
        }
    }

    const handleSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    }
    return(
        <div>
            <Navbar />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={handleSidebar}/>
            <h2><center>Settings</center></h2>
            <form onSubmit={handleChangePassword}>
            <center>
                <label htmlFor="password">Enter Old password:</label>
                <input 
                type="password"
                id="password"
                name="oldpassword"
                placeholder=""
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                />
                <p></p>
                <label htmlFor="oldpassword">Enter New password:</label>
                <input 
                id="newpassword"
                type="password"
                name="newpassword"
                placeholder=""
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                />
                <p></p>
                <label htmlFor="newpassword">Confirm new password:</label>
                <input
                id="confirmnewpassword"
                type="password"
                name="confirmnewpassword"
                placeholder=""
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                />
                <p></p>
                <button type="submit">Change password</button>
            </center>
            </form>
        </div>
    );
}

export default Settings;