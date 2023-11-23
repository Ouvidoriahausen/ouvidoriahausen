import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import Admin from '../Pages/Admin';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';

import Private from "./Private"

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastrar" element={<Cadastrar />} />
      <Route path="/novo-chamado" element={<Private><NovoChamado /></Private>} />
      <Route path="/admin" element={<Private><Admin /></Private>} />
      <Route path="/meus-chamados" element={<Private><MeusChamados /></Private>} />
    </Routes>
  );
}