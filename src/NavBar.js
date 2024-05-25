import React, { useState } from 'react';
import './NavBar.css'; // Importa il file CSS per lo stile della navbar
import { FaBars } from 'react-icons/fa'; // Importa l'icona del menu
import AnchorLink from "react-anchor-link-smooth-scroll";

const NavBar = ({changeType, type}) => {
  const [isOpen, setIsOpen] = useState(false); // stato iniziale del menu: chiuso

  const toggleMenu = () => {
    setIsOpen(!isOpen); // cambia lo stato del menu
  };

  return (
    <nav className={!isOpen ? "navbar" : "navbar-open"}>
      <span className="menu-icon" onClick={toggleMenu}>
        <FaBars />
      </span>
      <ul className={isOpen ? "navbar-list open" : "navbar-list"}>
        <div>
          <li><AnchorLink  href="#t">Temperatura</AnchorLink ></li>
          <li><AnchorLink  href="#hi">HeatIndex</AnchorLink ></li>
          <li><AnchorLink  href="#u">Umidità</AnchorLink ></li>
        </div> 
      </ul>
      {!isOpen && <button className='nav-button' onClick={()=> {
        changeType((lastState) => { return !lastState} )
      }}><b style={{color: type ? "red" : "black"}}>C</b> / <b style={{color: !type ? "red" : "black"}}>F</b></button>}
    </nav>
  );
};

export default NavBar;
