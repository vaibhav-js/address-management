import React from 'react';
import '../styles/Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Sidebar = props => {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar"
  return (
    <div className={sidebarClass}>
      <ul className="sidebar-menu">
        <li>
          <a href="/dashboard">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      <button onClick={props.toggleSidebar} className='sidebar-toggle'><FontAwesomeIcon icon={faBars} /></button>
    </div>
  );
};

export default Sidebar;
