import React, { useState } from 'react';
import axios from 'axios';

const ContentPanel = ({ selectedElement }) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [views, setViews] = useState([]);
  const [error, setError] = useState('');

  const API_KEY = 'B992O8DINY2BFCJT';

  const validateInputs = () => {
    if (!symbol || !quantity || !price) {
      setError('All fields are required!');
      return false;
    }
    setError('');
    return true;
  };

  const fetchStockData = async () => {
    const BASE_URL = 'https://www.alphavantage.co/query';
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      const data = response.data;
  
      if (data['Note']) {
        setError('API request limit reached. Try again later.');
        return null;
      }
  
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const currentPrice = parseFloat(data['Global Quote']['05. price']);
        return currentPrice;
      } else {
        setError('Invalid stock symbol or data unavailable');
        return null;
      }
    } catch (error) {
      setError('Error fetching stock data');
      console.error('Error fetching stock data:', error);
      return null;
    }
  };
  


  const addStockToViews = (currentPrice) => {
    const profitLoss = (currentPrice - parseFloat(price)) * parseInt(quantity);
    const stockView = {
      symbol,
      quantity,
      purchasePrice: price,
      currentPrice,
      profitLoss: profitLoss.toFixed(2),
    };

    setViews([...views, stockView]);  // Append new stock data to views
  };

  const handleAddStock = async () => {
    if (validateInputs()) {
      const currentPrice = await fetchStockData();
      if (currentPrice !== null) {
        addStockToViews(currentPrice);
      }
    }
  };

  return (
    <div className="contentpanel">

      {selectedElement === 'Stocks' && (
        <div className="panel">
          <div className="container">
            <input
              type="text"
              placeholder="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Purchase Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="button"
              value="Add Stocks"
              className="addStockBtn"
              onClick={handleAddStock}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="views">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Price</th>
                  <th>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {views.map((view, index) => (
                  <tr key={index}>
                    <td>{view.symbol}</td>
                    <td>{view.quantity}</td>
                    <td>${view.purchasePrice}</td>
                    <td>${view.currentPrice}</td>
                    <td>
                      {view.profitLoss >= 0 ? '+' : '-'}${Math.abs(view.profitLoss)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      )}
      {selectedElement === 'Tables' && <p>This is the Tables content.</p>}
      {selectedElement === 'Billing' && <p>This is the Billing content.</p>}
      {selectedElement === 'RTL' && <p>This is the RTL content.</p>}
    </div>
  );
};

export default ContentPanel;
