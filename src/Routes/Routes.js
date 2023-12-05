import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SideBar } from '../components/layout/Sidebar';

// Common user pages
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';
import ChamadosDetails from '../Pages/ChamadosDetails';

import Private from "./Private"
import NotFound from '../Pages/NotFound';

// Admin and Master pages
import Admin from '../Pages/Admin';
import ChamadosDetailsAdmin from '../Pages/Admin/ChamadosDetailsAdmin';
import DashboardMaster from '../Pages/DashboardMaster';
import MasterPrivate from "./MasterPrivate"
import AdminPrivate from './AdminPrivate';
import Terms from '../Pages/Terms';

export default function RoutesApp() {

  const path = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    // Caso o usuário acessar rotas sem componentes
    switch (path) {
      case "/admin":
        navigate("/admin/aberto")
        break;
      case "/admin/":
        navigate("/admin/aberto")
        break;

      default:
        break;
    }
  }, [path, navigate]);


  const badRoutes = ["/login", "/cadastrar", "/"]

  return (
    <>
      {!badRoutes.find(route => route === path) ? <SideBar /> : null}
      <Routes>
        {/* User */}
        <Route path="/" element={<Home />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/novo-chamado" element={<Private><NovoChamado /></Private>} />
        <Route path="/meus-chamados" element={<Private><MeusChamados /></Private>} />
        <Route path="/meus-chamados/:id" element={<Private><ChamadosDetails /></Private>} />

        <Route path="/admin" element={<AdminPrivate><Admin /></AdminPrivate>} />
        <Route path="/admin/:statusPage" element={<AdminPrivate><Admin /></AdminPrivate>} />
        <Route path="/admin/:statusPage/:id" element={<AdminPrivate><ChamadosDetailsAdmin /></AdminPrivate>} />

        <Route path="/dashboard" element={<MasterPrivate><DashboardMaster /></MasterPrivate>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}