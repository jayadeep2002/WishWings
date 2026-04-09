import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const log = (msg) => {
  const logs = JSON.parse(sessionStorage.getItem('debug_logs') || '[]');
  logs.push(`${new Date().toISOString()}: ${msg}`);
  sessionStorage.setItem('debug_logs', JSON.stringify(logs.slice(-50)));
  console.log(msg);
};

log('--- MAIN MOUNT START ---');

window.onerror = (e) => log('GLOBAL ERROR: ' + e);
window.onunhandledrejection = (e) => log('UNHANDLED REJECTION: ' + e.reason);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  log('App rendered to root');
} else {
  log('ERROR: Root element not found');
}
