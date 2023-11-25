import { Routes, Route, useLocation } from 'react-router-dom';
import { SideBar } from '../components/layout/sidebar';

import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import Admin from '../Pages/Admin';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';

import Private from "./Private"
import NotFound from '../Pages/NotFound';

import EmAberto from '../Pages/Admin/EmAberto';
import Finalizados from '../Pages/Admin/Finalizados';

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
        <Route path="/admin/em-andamento" element={<Private><EmAberto /></Private>} />
        <Route path="/admin/finalizados" element={<Private><Finalizados /></Private>} />
        <Route path="/admin/arquivado" element={<Private><EmAberto /></Private>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}