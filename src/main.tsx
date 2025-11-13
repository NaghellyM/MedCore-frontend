import './index.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import router from './presentation/routes/routes.tsx'
import { AuthProvider } from './core/context/authContext.tsx';
import { Toaster } from './presentation/components/ui/toaster.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </StrictMode>

  );
}
