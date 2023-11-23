import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import "./notFound.css"

export default function NotFound() {
    return (
        <div className="container-center">
            <h1>Página não encontrada!</h1>
            <Link to="/">
                <Button variant="contained">Voltar para o Início</Button>
            </Link>
        </div>
    )
}
