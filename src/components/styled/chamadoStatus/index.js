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
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
            break;
        case "finalizado":
            statusText = "Finalizado";
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
            break;
        case "andamento":
            statusText = "Em Andamento";
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
            break;
        case "arquivado":
            statusText = "Arquivado";
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
            break;
        case "morto":
            statusText = "Cancelado";
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
            break;
        case "detalhes":
            statusText = "Precisa de detalhes";
            statusPopup = "Seu chamado está em aberto para ser visualizado, porém ainda não foi desenvolvido nada com ele."
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