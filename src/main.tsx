import './index.css'
import ReactDOM from 'react-dom/client'
import router from './routes/index.tsx'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
