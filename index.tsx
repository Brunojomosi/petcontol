import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Apenas tenta registrar se estivermos na mesma origem, evitando erros em ambientes de preview
    const swUrl = new URL('./sw.js', import.meta.url);
    if (swUrl.origin === window.location.origin) {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('SW registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.warn('Registro de Service Worker falhou:', error);
        });
    } else {
      console.log('Service Worker ignorado devido a mismatch de origem (comum em previews).');
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);