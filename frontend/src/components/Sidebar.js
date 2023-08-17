import React from 'react';
import '../styles/Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Accordion } from 'react-bootstrap';


const Sidebar = (props) => {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar"

  return (
    <div className={sidebarClass}>  
      <button onClick={props.toggleSidebar} className='sidebar-toggle'><FontAwesomeIcon icon={faBars} /></button>
      <Accordion>
        {Array.isArray(props.accessibles) && props.accessibles.length > 0 ? (props.accessibles.map(accessible => (
                  
                  <Accordion.Item key= {accessible.id} eventKey={accessible.id.toString()}>
                  <Accordion.Header>{accessible.name}</Accordion.Header>
                  <Accordion.Body>{accessible.value}</Accordion.Body>
                  </Accordion.Item>
        
        ))) : <h5>No accessibles to show.</h5>}

      </Accordion>

    </div>
  );
};

export default Sidebar;
