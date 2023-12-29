import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SideBar } from '../components/layout/sidebar';

// Common user pages
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import NovoChamado from '../Pages/NovoChamado';
import MeusChamados from '../Pages/MeusChamados';
import ChamadosDetails from '../Pages/ChamadosDetails';

import { AdminPrivate, ComumPrivate, MasterPrivate } from "./Private"

// Admin and Master pages
import Admin from '../Pages/Admin';
import ChamadosDetailsAdmin from '../Pages/Admin/ChamadosDetailsAdmin';
import MenuMaster from '../Pages/MenuMaster';
import ChamadosCancelados from '../Pages/ChamadosCancelados';

import NotFound from '../Pages/NotFound';

export default function RoutesApp() {

  const path = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    // Caso o usuário acesse rotas específicas
    if (path === "/admin" || path === "/admin/") {
      if (!path.endsWith("/")) {
        navigate("/admin/aberto"); // Redireciona para /admin/aberto se a rota não terminar com "/"
      }
    }
  }, [path, navigate]);
  


  const badRoutes = ["/login", "/cadastrar", "/", "/termos"]

  return (
    <>
      {!badRoutes.find(route => route === path) ? <SideBar /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/novo-chamado" element={<ComumPrivate><NovoChamado /></ComumPrivate>} />
        <Route path="/chamados" element={<ComumPrivate><MeusChamados /></ComumPrivate>} />
        <Route path="/chamados/:id" element={<ComumPrivate><ChamadosDetails /></ComumPrivate>} />
        <Route path="/cancelados" element={<ComumPrivate><ChamadosCancelados /></ComumPrivate>} />
        <Route path="/cancelados/:id" element={<ComumPrivate><ChamadosDetails /></ComumPrivate>} />

        <Route path="/admin" element={<AdminPrivate><Admin /></AdminPrivate>} />
        <Route path="/admin/:statusPage" element={<AdminPrivate><Admin /></AdminPrivate>} />
        <Route path="/admin/:statusPage/:id" element={<AdminPrivate><ChamadosDetailsAdmin /></AdminPrivate>} />

        <Route path="/menu" element={<MasterPrivate><MenuMaster /></MasterPrivate>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}