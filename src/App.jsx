import './App.css';
import React from 'react';
import { StockProvider } from './contexts/stockContext';
import ContentPanel from './components/ContentPanel';

function App() {
  return (
    <div className="dashboard">
      <div className="main-content">
        <StockProvider>
          <ContentPanel />
        </StockProvider>
      </div>
    </div>
  );
}

export default App;
