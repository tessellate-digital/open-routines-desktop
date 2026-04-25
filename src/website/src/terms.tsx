import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TermsAndConditions } from './TermsAndConditions';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TermsAndConditions />
  </StrictMode>
);
