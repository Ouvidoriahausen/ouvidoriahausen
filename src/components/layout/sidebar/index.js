import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"
import { Button, Tooltip } from "@mui/material"
import { AuthContext, LOCAL_STORAGE_KEY } from "../../../contexts/AuthContext"
import { useContext } from "react"

// Icons
import { PiTicketFill } from "react-icons/pi";
import { FiPlus, FiLogOut } from "react-icons/fi"
import { FaFolderOpen, FaUser } from "react-icons/fa"
import { MdArchive, MdDone, MdOutlineMoreHoriz } from "react-icons/md"
import { RiAdminFill } from "react-icons/ri";
import { useUserType } from "../../../hooks/useUserType"


export function SideBar() {

    const { logout } = useContext(AuthContext)
    const UserLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const userStorage = JSON.parse(UserLocalStorage)
    const userType = useUserType()

    return (
        <div className="sidebar-container">
            <section className="navbar">

                <div className="navbrand">
                    <img src={LogoOuvidoria} alt='Ouvidoria' />
                </div>

                {userType === "admin" || userType === "master" ? (
                    <nav variant="pills" className="nav">
                        <h3 className="sidebar-title">Chamados</h3>

                        <span className="divider" />

                        <section className="nav-links">
                            <Link to="/admin/aberto">
                                <Button size="large" fullWidth>
                                    <FaFolderOpen size={30} />
                                    Em aberto
                                </Button>
                            </Link>

                            <Link to="/admin/andamento">
                                <Button size="large" fullWidth>
                                    <MdOutlineMoreHoriz size={30} />
                                    Em Andamento
                                </Button>
                            </Link>

                            <Link to="/admin/finalizado">
                                <Button size="large" fullWidth>
                                    <MdDone size={30} />
                                    Finalizados
                                </Button>
                            </Link>

                            <Link to="/admin/arquivado">
                                <Button size="large" fullWidth>
                                    <MdArchive size={30} />
                                    Arquivados
                                </Button>
                            </Link>
                        </section>
                    </nav>
                ) : (
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
                )}

                <div className="nav-logout">
                    {userType === "master" && <Link to="/dashboard">
                        <Button size="large" fullWidth>
                            <RiAdminFill size={25} />
                            Dashboard
                        </Button>
                    </Link>}

                    <span className="divider" />

                    <section>
                        <div className="nav-userName">
                            <FaUser size={25} />
                            <p>
                                {userStorage.nome}
                                {userType !== "comum" && <span>{userType}</span>}
                            </p>
                        </div>

                        <Tooltip title="Sair" placement="right">
                            <Button onClick={logout} color="error" variant="contained">
                                <FiLogOut size={25} />
                            </Button>
                        </Tooltip>
                    </section>
                </div>
            </section>
        </div>
    )
}