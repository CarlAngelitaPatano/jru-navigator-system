import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';                   // Make sure App.jsx exists in src/
import reportWebVitals from './reportWebVitals.js';  // Add .js extension

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: measure performance
reportWebVitals();
