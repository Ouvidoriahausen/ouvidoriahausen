import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import { AuthContext, LOCAL_STORAGE_KEY } from "../../../contexts/AuthContext"
import { useContext, useEffect } from "react"

// Icons
import { Logout, Person } from '@mui/icons-material';
import { PiTicketFill } from "react-icons/pi";
import { FiPlus } from "react-icons/fi"
import { FaFolderOpen } from "react-icons/fa"
import { MdArchive, MdDone, MdOutlineMoreHoriz } from "react-icons/md"
import { RiAdminFill } from "react-icons/ri";

import { useCheckUserType } from "../../../Pages/Admin/utils/checkUserType"

// Sidebar do usuário
export function SideBar() {

    const { logout } = useContext(AuthContext)
    const { isAdmin, checkUserType } = useCheckUserType()
    const UserLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const userStorage = JSON.parse(UserLocalStorage)

    useEffect(() => {
        checkUserType(userStorage.uid)
    }, []);

    return (
        <div className="sidebar-container">
            <section className="navbar">

                <div className="navbrand">
                    <img src={LogoOuvidoria} alt='Ouvidoria' />
                </div>


                <nav variant="pills" className="nav">
                    <h3 className="sidebar-title">Chamados</h3>

                    <span className="divider" />

                    <section className="nav-links">
                        <Link to="/meus-chamados">
                            <Button size="large" fullWidth>
                                <PiTicketFill size={30} />
                                Meus Chamados
                            </Button>
                        </Link>


                        <Link to="/novo-chamado">
                            <Button size="large" fullWidth>
                                <FiPlus size={30} />
                                Novo Chamado
                            </Button>
                        </Link>
                    </section>
                </nav>

                <div className="nav-logout">
                    {isAdmin && <Link to="/admin">
                        <Button size="large" fullWidth>
                            <RiAdminFill size={25} />
                            Admin
                        </Button>
                    </Link>}

                    <span className="divider" />

                    <section>
                        <Person />
                        <span>{userStorage.nome}</span>

                        <Button onClick={logout} color="error" variant="contained">
                            <Logout />
                        </Button>
                    </section>
                </div>
            </section>
        </div>
    )
}


// Sidebar Administrador
export function SideBarAdmin() {

    const { logout } = useContext(AuthContext)
    const UserLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const UserName = JSON.parse(UserLocalStorage)

    return (
        <div className="sidebar-container">
            <section className="navbar">

                <div className="navbrand">
                    <img src={LogoOuvidoria} alt='Ouvidoria' />
                </div>


                <nav variant="pills" className="nav">
                    <h3 className="sidebar-title">Chamados</h3>

                    <span className="divider" />

                    <section className="nav-links">
                        <Link to="/admin/em-aberto">
                            <Button size="large" fullWidth>
                                <FaFolderOpen size={30} />
                                Em aberto
                            </Button>
                        </Link>

                        <Link to="/admin/em-andamento">
                            <Button size="large" fullWidth>
                                <MdOutlineMoreHoriz size={30} />
                                Em Andamento
                            </Button>
                        </Link>

                        <Link to="/admin/finalizados">
                            <Button size="large" fullWidth>
                                <MdDone size={30} />
                                Finalizados
                            </Button>
                        </Link>

                        <Link to="/admin/arquivados">
                            <Button size="large" fullWidth>
                                <MdArchive size={30} />
                                Arquivados
                            </Button>
                        </Link>
                    </section>
                </nav>

                <div className="nav-logout">
                    <span className="divider" />
                    <section>
                        <Person />
                        <span>{UserName.nome}</span>

                        <Button onClick={logout} color="error" variant="contained">
                            <Logout />
                        </Button>
                    </section>
                </div>
            </section>
        </div>
    )
}