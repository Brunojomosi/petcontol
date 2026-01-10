import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Usamos window.location.href como base para evitar erros de "Invalid URL"
      // que podem ocorrer com import.meta.url em certos ambientes de execução.
      const swUrl = new URL('./sw.js', window.location.href);
      
      // Apenas tenta registrar se estivermos na mesma origem, evitando erros de segurança em previews.
      if (swUrl.origin === window.location.origin) {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('SW registrado com sucesso:', registration.scope);
          })
          .catch(error => {
            console.warn('Registro de Service Worker falhou:', error);
          });
      } else {
        console.log('Service Worker ignorado: mismatch de origem.');
      }
    } catch (e) {
      console.warn('Erro ao processar URL do Service Worker:', e);
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