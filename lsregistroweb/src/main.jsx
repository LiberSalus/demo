// src/main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { AppRoutes } from '@/routes/AppRouter';   // ajusta alias/ruta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />      
    
  </React.StrictMode>
);
