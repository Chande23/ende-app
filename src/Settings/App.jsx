import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import Home from '../../Components/Home';
import Divida from '../../Components/Divida';
import Historico from '../../Components/Historico';
import DispositivoPotencia from '../../Components/index';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/divida" element={<Divida />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/dispositivo" element={<DispositivoPotencia />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;