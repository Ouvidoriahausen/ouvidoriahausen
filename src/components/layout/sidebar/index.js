import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"
import { Button, Tooltip } from "@mui/material"
import { AuthContext, LOCAL_STORAGE_KEY } from "../../../contexts/AuthContext"
import { useContext } from "react"

// Icons
import { PiTicketFill, PiSkullBold } from "react-icons/pi";
import { FiPlus, FiLogOut } from "react-icons/fi"
import { FaFolderOpen, FaUser } from "react-icons/fa"
import { MdArchive, MdDone, MdOutlineMoreHoriz, MdClose } from "react-icons/md"
import { RiAdminFill } from "react-icons/ri";

// Utils
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

                            <Link to="/admin/morto">
                                <Button size="large" fullWidth>
                                    <PiSkullBold size={30} />
                                    Arq. Mortos
                                </Button>
                            </Link>
                        </section>
                    </nav>
                ) : (
                    <nav variant="pills" className="nav">
                        <h3 className="sidebar-title">Chamados</h3>

                        <span className="divider" />
                        <section className="nav-links">
                            <Link to="/chamados">
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
                    {userType === "comum" && <Link to="/cancelados">
                        <Button size="large" fullWidth>
                            <MdClose size={30} />
                            Cancelados
                        </Button>
                    </Link>}

                    {userType === "master" && <Link to="/menu">
                        <Button size="large" fullWidth>
                            <RiAdminFill size={25} />
                            Menu
                        </Button>
                    </Link>}

                    <span className="divider" />

                    <section>
                        <div className="nav-userName">
                            <FaUser size={25} />
                            <p>
                                {userStorage.nome}
                            </p>
                            {userType !== "comum" && <p className="userType">{userType}</p>}
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