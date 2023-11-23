import "./sidebar.css"
import LogoOuvidoria from "../../../assets/header-ouvidoria.png"
import { Link } from "react-router-dom"

export function SideBar() {

    return (
        <div className="sidebar-container">
            <section className="navbar">

                <div className="navbrand">
                    <img src={LogoOuvidoria} alt='Ouvidoria' />
                </div>


                <nav variant="pills" className="nav">
                    <section className="nav-links">
                        <Link>
                            <span>Chamados Em aberto</span>
                        </Link>

                        <Link>
                            <span>Chamados Lidos</span>
                        </Link>
                    </section>
                </nav>
            </section>
        </div>
    )
}