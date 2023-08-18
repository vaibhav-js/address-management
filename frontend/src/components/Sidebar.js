import React from 'react';
import '../styles/Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'


const Sidebar = (props) => {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar"

  return (
    <div className={sidebarClass}>  
      <button onClick={props.toggleSidebar} className='sidebar-toggle'>
        {
          props.isOpen ? <FontAwesomeIcon icon={faArrowLeft} size='lg' beatFade /> : <FontAwesomeIcon icon={faArrowRight} size='lg' beatFade />
        }
      </button>
      <ul className="sidebar-menu">
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/">Profile</a>
        </li>
        <li>
          <a href="/contact">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
