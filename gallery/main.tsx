import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '../src';
import { Gallery } from './Gallery';
import './gallery.css';

createRoot(document.getElementById('gallery') as HTMLElement).render(
  <StrictMode>
    <ToastProvider>
      <Gallery />
    </ToastProvider>
  </StrictMode>,
);
