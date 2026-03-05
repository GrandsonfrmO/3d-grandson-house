import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppWithRouting from './AppWithRouting.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithRouting />
  </StrictMode>,
);
