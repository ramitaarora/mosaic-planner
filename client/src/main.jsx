import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Error from './pages/Error.jsx';
import Account from './pages/Account.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Landing />}/>
  </React.StrictMode>
);