import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import "./notFound.css"
import { useUserType } from '../../hooks/useUserType'
import { FaRobot } from "react-icons/fa";

export default function NotFound() {

    const userType = useUserType()

    let buttonText = ""
    let linkPath = ""

    switch (userType) {
        case "admin":
        case "master":
            buttonText = "Voltar para página de Admin"
            linkPath = "/admin"
            break
        case "comum":
            buttonText = "Voltar para Chamados"
            linkPath = "/chamados"
            break
        default:
            buttonText = "Voltar para Início"
            linkPath = "/"
            break
    }

    return (
        <div className="container-center-nf">
            <FaRobot size={100} />
            <h1>Página não encontrada!</h1>
            <Link to={linkPath}>
                <Button variant="contained">
                    {buttonText}
                </Button>
            </Link>
        </div>
    )
}
