import "./chamadoStatus.css"

// Status Styles
const statusStyles = {
    "aberto": {
        backgroundColor: "#ff0000",
        color: "#fff",
    },
    "finalizado": {
        backgroundColor: "#23D500",
        color: "#fff",
    },
    "andamento": {
        backgroundColor: "#FFD000",
        color: "var(--dark-blue)",
    },
    "arquivado": {
        backgroundColor: "#7B7B7B",
        color: "#fff",
    },
    "morto": {
        backgroundColor: "#7B7B7B",
        color: "#fff",
    },
    "detalhes": {
        backgroundColor: "#FFD000",
        color: "var(--dark-blue)",
    }
}

export const ChamadoStatus = ({ status }) => {
    const statusKey = status.toLowerCase();
    const getStatus = statusStyles[statusKey];
    let statusText = ""
    let statusPopup = ""

    switch (statusKey) {
        case "aberto":
            statusText = "Em Aberto";
            statusPopup = "Seu relato foi recebido em nosso sistema. Aguardando um de nossos especialistas analisar."
            break;
        case "finalizado":
            statusText = "Finalizado";
            statusPopup = "Seu relato foi finalizado em nosso sistema. Caso continue com dúvida abra um novo relato."
            break;
        case "andamento":
            statusText = "Em Andamento";
            statusPopup = "Seu relato está sendo analisado pelos nossos especialistas."
            break;
        case "arquivado":
            statusText = "Arquivado";
            statusPopup = "Seu relato foi araquivado em nosso sistema. Caso continue com dúdiva abra um novo relato."
            break;
        case "morto":
            statusText = "Cancelado";
            statusPopup = " Seu relato foi cancelado em nosso sistema. Abra um novo relato."
            break;
        case "detalhes":
            statusText = "Falta detalhes";
            statusPopup = " Após análise de nossos especialistas, falta informações para darmos continuidade no relato."
            break;
        default:
            statusText = "...";
    }

    return (
        <div className="chamado-status" style={getStatus}>
            <span>{statusText}</span>
            <p className="status-popup" style={getStatus}>{statusPopup}</p>
        </div>
    );
};