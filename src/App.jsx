import './App.css';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ContentPanel from './ContentPanel';
import Navbar from './components/Navbar';

function App() {
  const [selectedElement, setSelectedElement] = useState('Dashboard');

  return (
    <div className="dashboard">
      <Sidebar selectedElement={selectedElement} setSelectedElement={setSelectedElement} />
      <div className="main-content">
        <Navbar selectedElement={selectedElement} />
        <ContentPanel selectedElement={selectedElement} />
      </div>
    </div>
  );
}

export default App;
