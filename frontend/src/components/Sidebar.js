import React from 'react';
import '../styles/Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
const converter = require('number-to-words')


const Sidebar = (props) => {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar"

  return (
    <div className={sidebarClass}>  
       
      <div className="accordion" id="accordionExample">
        {Array.isArray(props.accessibles) && props.accessibles.length > 0 && props.accessibles.map(accessible => (
          <div className="accordion-item" key={accessible.id}>
            <h2 className="accordion-header" id={`heading${converter.toWords(accessible.id)}`}>
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${converter.toWords(accessible.id)}`} aria-expanded="true" aria-controls={`collapse${converter.toWords(accessible.id)}`}>
              {accessible.name}
            </button>
            </h2>
            <div id={`collapse${converter.toWords(accessible.id)}`} className="accordion-collapse collapse show" aria-labelledby={`heading${converter.toWords(accessible.id)}`} data-bs-parent="#accordionExample">
              <div className="accordion-body"><strong>{accessible.value}</strong>
              </div>
            </div>
          </div>
        ))}
        </div>
      <button onClick={props.toggleSidebar} className='sidebar-toggle'><FontAwesomeIcon icon={faBars} /></button>
    </div>
  );
};

export default Sidebar;
