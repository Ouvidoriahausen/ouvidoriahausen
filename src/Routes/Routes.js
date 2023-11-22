import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Loginesenha from '../Pages/Loginesenha';
import Cadastrar from '../Pages/Cadastrar';
import Ticket from '../Pages/Ticket';
import Admin from '../Pages/Admin';
import MeusTickets from "../Pages/MeusTickets"

import Private from "./Private"

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loginesenha" element={<Loginesenha />} />
      <Route path="/cadastrar" element={<Cadastrar />} />
      <Route path="/Ticket" element={<Private><Ticket /></Private>} />
      <Route path="/Admin" element={<Private><Admin /></Private>} />
      <Route path="/MeusTickets" element={<Private><MeusTickets /></Private>} />
    </Routes>
  );
}

export default RoutesApp;