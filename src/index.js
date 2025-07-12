import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'remixicon/fonts/remixicon.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
     <App />
    </HelmetProvider>
  </React.StrictMode>
);

