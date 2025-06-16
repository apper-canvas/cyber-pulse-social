import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout';
import routes, { routeArray } from '@/config/routes';

function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-background text-gray-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={React.createElement(route.element)}
              />
            ))}
            <Route index element={React.createElement(routeArray[0].element)} />
            <Route path="*" element={<div className="flex items-center justify-center h-screen text-gray-400">Page not found</div>} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
className="z-[9999]"
          toastClassName="bg-surface border border-gray-200"
          progressClassName="bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;