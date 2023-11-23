import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import { AuthContext, LOCAL_STORAGE_KEY } from "../../../contexts/AuthContext"
import { useContext } from "react"

// Icons
import { Logout, Person } from '@mui/icons-material';





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
                    <section className="nav-links">
                        <Link to="/meus-chamados">
                            <Button size="large" fullWidth>
                                Meus Chamados
                            </Button>
                        </Link>

                        <Link to="/novo-chamado">
                            <Button size="large" fullWidth>
                                Criar novo Chamado
                            </Button>
                        </Link>
                    </section>
                </nav>

                <div className="nav-logout">
                    <div>
                        <Person />
                        <span>{UserName.nome}</span>
                    </div>

                    <Button onClick={logout} color="error" variant="contained">
                        <Logout />
                    </Button>
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
                    <section className="nav-links">
                        <Link to="#">
                            <Button size="large" fullWidth>
                                Em aberto
                            </Button>
                        </Link>

                        <Link to="#">
                            <Button size="large" fullWidth>
                                Em Andamento
                            </Button>
                        </Link>

                        <Link to="#">
                            <Button size="large" fullWidth>
                                Fechados
                            </Button>
                        </Link>
                    </section>
                </nav>

                <div className="nav-logout">
                    <div>
                        <Person />
                        <span>{UserName.nome}</span>
                    </div>

                    <Button onClick={logout} color="error" variant="contained">
                        <Logout />
                    </Button>
                </div>
            </section>
        </div>
    )
}