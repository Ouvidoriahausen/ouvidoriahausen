import { Routes, Route, useLocation } from 'react-router-dom';

import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import Admin from '../Pages/Admin';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';

import Private from "./Private"
import NotFound from '../Pages/NotFound';

import { SideBar } from '../components/layout/sidebar';
import EmAberto from '../Pages/Admin/EmAberto';

export default function RoutesApp() {

  const path = useLocation().pathname

  const goodRoutes = ["/novo-chamado", "/meus-chamados"]

  return (
    <>
      {goodRoutes.find(route => route === path) ? <SideBar /> : null}
      <Routes>
        {/* User */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/novo-chamado" element={<Private><NovoChamado /></Private>} />
        <Route path="/meus-chamados" element={<Private><MeusChamados /></Private>} />

        {/* Admin */}
        <Route path="/admin" element={<Private><Admin /></Private>} />
        <Route path="/admin/em-aberto" element={<Private><EmAberto /></Private>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}