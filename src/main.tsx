import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from '../App';
import { initAnalytics } from '../lib/analytics';
import { LangProvider } from '../lib/i18n';
import '../globals.css';

initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
