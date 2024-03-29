import "./meusChamados.css"
import { useContext, useEffect } from "react"
import { Link } from "react-router-dom";

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";

//Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useLoadChamados } from "../../hooks/useLoadChamados";
import { useHandleCancelChamado } from "../../hooks/useHandleCancelChamado";

//Icons and Components
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { ImCancelCircle } from "react-icons/im";
import { FiPlus } from "react-icons/fi"
import { CgDetailsMore } from "react-icons/cg";
import { ChamadoStatus } from "../../components/styled/chamadoStatus"


export default function MeusChamados() {

    const { user } = useContext(AuthContext);
    const { loadChamados, userChamados, loadingChamados } = useLoadChamados()
    const { handleCancelChamado } = useHandleCancelChamado()

    useEffect(() => {
        loadChamados()
    }, [user.uid, loadChamados]);

    if (loadingChamados) {
        return (
            <Content className="loading-container">
                <Title>Carregando chamados...</Title>
                <div>
                    <CircularProgress color="primary" />
                </div>
            </Content>
        )
    }


    return (
        <Content className="chamados-container">
            <Title>Meus Chamados</Title>

            {userChamados.length === 0 ? (
                <div className="chamadosEmpty">
                    <h1>Nenhum chamado encontrado.</h1>
                    <Link to="/novo-chamado" style={{ color: "#fff", float: "right", marginBottom: "15px" }}>
                        <Button color="thirty" variant="contained" startIcon={<FiPlus size={25} />}>
                            Novo Chamado
                        </Button>
                    </Link>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Titulo</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Status</th>
                            <th scope="col">Resposta</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {userChamados.map((chamado, index) => (
                            <tr key={index}>
                                <td data-label="ID">{chamado.newID}</td>
                                <td data-label="Titulo">{chamado.titulo}</td>
                                <td data-label="Descrição">{chamado.descricao}</td>
                                <td data-label="Status">
                                    <ChamadoStatus status={chamado.status} />
                                </td>
                                <td data-label="Resposta">
                                    <span>
                                        {chamado.resposta === "" ? "..." : chamado.resposta}
                                    </span>
                                </td>
                                <td className="actions" data-label="Ações">
                                    <Link to={`/chamados/${chamado.id}`}>
                                        <Tooltip title="Detalhes">
                                            <IconButton color="secondary" size="large" className="action">
                                                <CgDetailsMore size={20} />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>

                                    {chamado.status === "aberto" && <Tooltip title="Cancelar" onClick={() => handleCancelChamado(chamado.id)}>
                                        <IconButton color="error" size="large" className="action">
                                            <ImCancelCircle size={20} />
                                        </IconButton>
                                    </Tooltip>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Content>
    )
}
