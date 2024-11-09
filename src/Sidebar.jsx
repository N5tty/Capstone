import React from 'react';
import { Home, Award } from 'react-feather';

const Sidebar = ({ setSelectedElement, selectedElement }) => {
  return (
    <div className="sidebar">
      <p className="logo">
        <Award className="icon" size={15} /> FinSight
      </p>
      <hr />
      <ul>
        <li
          onClick={() => setSelectedElement('Stocks')}
          className={selectedElement === 'Stocks' ? 'selected' : ''}
        >
          <Home className="icon" size={15} /> Stocks
        </li>
        <li
          onClick={() => setSelectedElement('Tables')}
          className={selectedElement === 'Tables' ? 'selected' : ''}
        >
          <Home className="icon" size={15} /> Tables
        </li>
        <li
          onClick={() => setSelectedElement('Billing')}
          className={selectedElement === 'Billing' ? 'selected' : ''}
        >
          <Home className="icon" size={15} /> Billing
        </li>
        <li
          onClick={() => setSelectedElement('RTL')}
          className={selectedElement === 'RTL' ? 'selected' : ''}
        >
          <Home className="icon" size={15} /> RTL
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
