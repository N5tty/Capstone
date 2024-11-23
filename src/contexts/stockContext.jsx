import React, { createContext, useState, useContext } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);

  // Function to add a stock
  const addStock = (stock) => {
    setStocks((prevStocks) => [...prevStocks, stock]);
  };

  // Function to update a stock's details or remove it if quantity becomes zero
  const updateStocks = (updatedStock) => {
    setStocks((prevStocks) => {
      // If the stock quantity is zero, filter it out from the list
      if (updatedStock.quantity === 0) {
        return prevStocks.filter((stock) => stock.symbol !== updatedStock.symbol);
      }

      // Otherwise, update the stock if it exists
      return prevStocks.map((stock) =>
        stock.symbol === updatedStock.symbol ? updatedStock : stock
      );
    });
  };

  return (
    <StockContext.Provider value={{ stocks, setStocks, addStock, updateStocks }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => useContext(StockContext);
