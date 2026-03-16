import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
  </StrictMode>
);
