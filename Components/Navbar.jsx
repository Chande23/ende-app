import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/divida">Dívida</Link></li>
        <li><Link to="/historico">Histórico</Link></li>
        <li><Link to="/dispositivo">Dispositivo</Link></li>
      
      </ul>
      
    </nav>
  );
};

export default Navbar;