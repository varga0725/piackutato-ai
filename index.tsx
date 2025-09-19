import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionContextProvider } from './src/components/SessionContextProvider'; // Kijavítva
import ToastProvider from './src/components/ToastProvider'; // Kijavítva
import Login from './src/pages/Login'; // Kijavítva
import Register from './src/pages/Register'; // Kijavítva

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider />
    <Router>
      <SessionContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </SessionContextProvider>
    </Router>
  </React.StrictMode>
);