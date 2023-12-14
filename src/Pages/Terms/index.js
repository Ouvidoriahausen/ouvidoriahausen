import "./terms.css"
import { useState } from 'react';
import { LuFileText } from "react-icons/lu";
import { Button } from '@mui/material';

export default function Terms() {
    const [terms, setTerms] = useState(false);

    const handleAceitarTermos = () => {
        // Define que o usuário aceitou os termos
        setTerms(true);
        // Armazena essa informação no localStorage
        localStorage.setItem('@hausen_terms', true);
    };

    if (terms || localStorage.getItem('@hausen_terms')) {
        return null; // Se o usuário já aceitou os termos, não exibe a tela inicial novamente
    }

    return (
        <section className="terms-container">
            <div className="terms-content">
                <div>
                    <LuFileText size={100} />
                    <h2>Nossos Termos</h2>
                </div>
                <p>Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.</p>
                <Button variant="contained" fullWidth color="thirty" size="large" onClick={handleAceitarTermos}>Aceitar</Button>
            </div>
        </section>
    );
};
