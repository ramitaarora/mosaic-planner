import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App.jsx'
import './App.css'

import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Goals from './pages/Goals.jsx';
import Error from './pages/Error.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/goals" element={<Goals />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </React.StrictMode>
);