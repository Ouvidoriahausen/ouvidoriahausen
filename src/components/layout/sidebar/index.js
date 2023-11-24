import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import { AuthContext, LOCAL_STORAGE_KEY } from "../../../contexts/AuthContext"
import { useContext } from "react"

// Icons
import { Done, Grade, Logout, MoreHoriz, Person } from '@mui/icons-material';
import { PiTicket } from "react-icons/pi";
import { FiPlus } from "react-icons/fi"

// Sidebar do usuário
export function SideBar() {

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
                        <Link to="/meus-chamados">
                            <Button size="large" fullWidth>
                                <PiTicket size={30} />
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
                        <Link to="#">
                            <Button size="large" fullWidth>
                                <Grade />
                                Em aberto
                            </Button>
                        </Link>

                        <Link to="#">
                            <Button size="large" fullWidth>
                                <MoreHoriz />
                                Em Andamento
                            </Button>
                        </Link>

                        <Link to="#">
                            <Button size="large" fullWidth>
                                <Done />
                                Finalizados
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