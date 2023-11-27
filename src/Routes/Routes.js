import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SideBar } from '../components/layout/sidebar';

import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import Admin from '../Pages/Admin';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';
import ChamadosDetails from '../Pages/ChamadosDetails';

import Private from "./Private"
import NotFound from '../Pages/NotFound';
import ChamadosDetailsAdmin from '../Pages/Admin/ChamadosDetailsAdmin';
import { useEffect } from 'react';

export default function RoutesApp() {

  const path = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (path === "/admin" || path === "/admin/") {
      navigate("/admin/aberto")
    }
  }, [path, navigate]);



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
        <Route path="/meus-chamados/:id" element={<Private><ChamadosDetails /></Private>} />

        {/* Admin */}
        <Route path="/admin" element={<Private><Admin /></Private>} />
        <Route path="/admin/:statusPage" element={<Private><Admin /></Private>} />
        <Route path="/admin/:statusPage/:id" element={<Private><ChamadosDetailsAdmin /></Private>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}