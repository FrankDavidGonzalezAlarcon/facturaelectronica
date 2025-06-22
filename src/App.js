import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Factura from './components/Factura';
import ClienteCRUD from './components/ClienteCRUD';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <Link to="/">Factura</Link>
          <Link to="/crud">Ver Datos</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Factura />} />
          <Route path="/crud" element={<ClienteCRUD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;