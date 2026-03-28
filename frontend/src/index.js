import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
    <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', boxShadow: '0 8px 32px rgba(108,99,255,.18)' }, success: { iconTheme: { primary: '#4CAF50', secondary: '#fff' } }, error: { iconTheme: { primary: '#EF5350', secondary: '#fff' } } }} />
  </AuthProvider>
);
