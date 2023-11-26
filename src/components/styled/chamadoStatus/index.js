// Status Styles
const statusStyles = {
    "em aberto": {
        backgroundColor: "#ff0000",
        color: "#fff",
    },
    "finalizado": {
        backgroundColor: "#23D500",
        color: "#fff",
    },
    "em andamento": {
        backgroundColor: "#FFD000",
        color: "var(--dark-blue)",
    },
    "arquivado": {
        backgroundColor: "#7B7B7B",
        color: "#fff",
    }
}

export const ChamadoStatus = ({ status }) => {
    const statusKey = status.toLowerCase();
    const getStatus = statusStyles[statusKey];
    let statusText = '';

    switch (statusKey) {
        case 'em aberto':
            statusText = 'Em Aberto';
            break;
        case 'finalizado':
            statusText = 'Finalizado';
            break;
        case 'em andamento':
            statusText = 'Em Andamento';
            break;
        case 'arquivado':
            statusText = 'Arquivado';
            break;
        default:
            statusText = '...';
    }

    return (
        <span className="chamado-status" style={getStatus}>
            {statusText}
        </span>
    );
};