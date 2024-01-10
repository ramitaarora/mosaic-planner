import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App.jsx'
import './App.css'

import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Error from './pages/Error.jsx';
import Account from './pages/Account.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </React.StrictMode>
);