import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useStockContext } from '../contexts/stockContext';
import icon from '../img/profile.png';

const ContentPanel = () => {
  const { stocks, addStock, setStocks } = useStockContext();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [sellModal, setSellModal] = useState(false);
  const [sellQuantity, setSellQuantity] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);


  const API_KEY = 'B992O8DINY2BFCJT';

  const validateInputs = useCallback(() => {
    if (!symbol || !quantity || !price) {
      setError('All fields are required!');
      return false;
    }
    setError('');
    return true;
  }, [symbol, quantity, price]);

  const fetchStockData = useCallback(async () => {
    const BASE_URL = 'https://www.alphavantage.co/query';
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data['Note']) {
        setError('API request limit reached. Try again later.');
        return null;
      }

      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return parseFloat(data['Global Quote']['05. price']);
      } else {
        setError('Invalid stock symbol or data unavailable');
        return null;
      }
    } catch (err) {
      setError('Error fetching stock data');
      console.error('Error fetching stock data:', err);
      return null;
    }
  }, [symbol]);

  const handleAddStock = useCallback(async () => {
    if (validateInputs()) {
      const totalCost = parseFloat(price) * parseInt(quantity);
      if (totalCost > wallet) {
        setError('Insufficient funds in the wallet to buy these stocks!');
        return;
      }

      const currentPrice = await fetchStockData();
      if (currentPrice !== null) {
        const newStock = {
          symbol,
          quantity,
          purchasePrice: price,
          currentPrice,
        };

        addStock(newStock);

        setWallet((prevWallet) => prevWallet - totalCost);
        setSymbol('');
        setQuantity('');
        setPrice('');
        setError('');
      }
    }
  }, [validateInputs, fetchStockData, addStock, wallet, symbol, quantity, price]);

  const handleSellStock = () => {
    if (!sellQuantity || isNaN(sellQuantity) || Number(sellQuantity) <= 0) {
      setError('Please enter a valid quantity to sell!');
      return;
    }

    const quantityToSell = parseInt(sellQuantity);

    if (quantityToSell > selectedStock.quantity) {
      setError('You cannot sell more than the available quantity!');
      return;
    }

    const updatedStocks = stocks.map((stock) => {
      if (stock.symbol === selectedStock.symbol) {
        const remainingQuantity = stock.quantity - quantityToSell;

        if (remainingQuantity === 0) return null;

        return {
          ...stock,
          quantity: remainingQuantity,
        };
      }
      return stock;
    }).filter(Boolean);

    setStocks(updatedStocks);

    const earnings = quantityToSell * selectedStock.currentPrice;
    setWallet((prevWallet) => prevWallet + earnings);

    setSellModal(false);
    setSellQuantity('');
    setSelectedStock(null);
    setError('');
  };

  const handleTopUpSubmit = () => {
    if (!topUpAmount || isNaN(topUpAmount) || Number(topUpAmount) <= 0) {
      setError('Please enter a valid amount!');
      return;
    }

    setWallet((prevWallet) => prevWallet + Number(topUpAmount));
    setShowModal(false);
    setTopUpAmount('');
    setError('');
  };


  return (
    <div className={`contentpanel ${showModal ? 'blurred' : ''}`}>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="header">Top Up Funds</p>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <button onClick={handleTopUpSubmit} className="primaryBtn">
              Submit
            </button>
            <button onClick={() => setShowModal(false)} className="secondaryBtn">
              Cancel
            </button>
          </div>
        </div>
      )}
      {sellModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="header">Sell Stock</p>
            <p>{selectedStock?.symbol}</p>
            <p>Quantity: {selectedStock?.quantity}</p>
            <input
              type="number"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(e.target.value)}
              placeholder="Enter quantity to sell"
            />
            <button onClick={handleSellStock} className="primaryBtn">
              Sell
            </button>
            <button onClick={() => setSellModal(false)} className="secondaryBtn">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="leftpanel">
        <div className="paneltop">
          <div className="addStockContainer">
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
              value="Buy Stocks"
              className="primaryBtn"
              onClick={handleAddStock}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="ccContainer">
            <div className="card-container">
              <div className="card">
                <div className="card-inner">
                  <div className="front">
                    <img src="https://i.ibb.co/PYss3yv/map.png" className="map-img" />
                    <div className="row">
                      <img src="https://i.ibb.co/G9pDnYJ/chip.png" width="60px" />
                      <img src="https://i.ibb.co/WHZ3nRJ/visa.png" width="60px" />
                    </div>
                    <div className="card-no">
                      <p>5244</p>
                      <p>2150</p>
                      <p>8252</p>
                      <p>6420</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profit-container">
            <p className="header">Aven Lam</p>
            <img src={icon} className="logo" alt="UserProfile"/>
          </div>
        </div>
        <div className="panelbottom">
          <div className="views">
            {stocks.length === 0 ? (
              <p className="no-stocks-message">
                No stocks available. Add your first stock to see details.
              </p>
            ) : (
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Purchase Price</th>
                    <th>Current Price</th>
                    <th>Profit/Loss</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.symbol}</td>
                      <td>{stock.quantity}</td>
                      <td>${stock.purchasePrice}</td>
                      <td>
                        {stock.currentPrice !== undefined
                          ? `$${stock.currentPrice}`
                          : 'N/A'}
                      </td>
                      <td
                        style={{
                          color: stock.profitLoss >= 0 ? 'green' : 'red',
                        }}
                      >
                        {stock.profitLoss !== undefined
                          ? `${stock.profitLoss >= 0 ? '+' : '-'}$${Math.abs(
                            stock.profitLoss
                          )}`
                          : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="secondaryBtn"
                          onClick={() => {
                            setSellModal(true);
                            setSelectedStock(stock);
                          }}
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>
        </div>
      </div>
      <div className="rightpanel">
        <div className="paneltop">
          <p className="header">
            Wallet: $<span className="profit">{wallet.toFixed(2)}</span>
          </p>
          <input
            type="button"
            value="Top Up Funds"
            className="primaryBtn"
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="panelbottom">
          <p className="header">Watchlists</p>
          <table>
            <thead>
              <tr className='trow'>
                <th>Symbol</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className='trow'>
                <td>
                  <p className='symbolName'>NVDA</p>
                  <p className='fullName'>Nvidia Corporation</p>
                </td>
                <td className="price">
                  <p>140.57</p>
                </td>
              </tr>
              <tr className='trow'>
                <td>
                  <p className='symbolName'>TSLA</p>
                  <p className='fullName'>Tesla Inc</p>
                </td>
                <td className="price">
                  <p>337.95</p>
                </td>
              </tr>
              <tr className='trow'>
                <td>
                  <p className='symbolName'>ADBE</p>
                  <p className='fullName'>Adobe Inc</p>
                </td>
                <td className="price">
                  <p>497.50</p>
                </td>
              </tr>
              <tr className='trow'>
                <td>
                  <p className='symbolName'>MSFT</p>
                  <p className='fullName'>Microsoft Corp</p>
                </td>
                <td className="price">
                  <p>413.09</p>
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="button"
            value="Add to Watchlist"
            className="primaryBtn"
          />
        </div>
      </div>
    </div >

  );
};

export default ContentPanel;
