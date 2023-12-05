import { useState } from 'react';
import "./terms.css"
import { LuFileCheck } from "react-icons/lu";

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
                    <LuFileCheck size={100} />
                    <h2>Nossos Termos</h2>
                </div>
                <p>Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.Aqui estão os termos que o usuário deve aceitar.</p>
                <button className="terms-accept" onClick={handleAceitarTermos}>Aceitar</button>
            </div>
        </section>
    );
};
