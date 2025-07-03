import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import routes from './modulos/auth/menuRoutes'; // Rutas internas sin slash inicial
import LoginForm from './modulos/LoginForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública del login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rutas protegidas bajo Dashboard */}
        <Route path="/" element={<Dashboard />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.Element}
            />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;