import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";

//Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useHandleCancelChamado } from "../../hooks/useHandleCancelChamado";
import { useUserType } from "../../hooks/useUserType";

//Icons and Components
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { ImCancelCircle } from "react-icons/im";
import { CgDetailsMore } from "react-icons/cg";
import { ChamadoStatus } from "../../components/styled/chamadoStatus"
import { useLoadChamadosCancelados } from "../../hooks/useLoadChamadosCancelados";


export default function ChamadosCancelados() {

    const { user } = useContext(AuthContext);
    const { chamadosCancelados, loadingChamados, loadChamadosCancelados } = useLoadChamadosCancelados()
    const { handleCancelChamado } = useHandleCancelChamado()

    const userType = useUserType()
    const navigate = useNavigate()


    // Verificação de usuário
    useEffect(() => {
        if (userType === "admin" || userType === "master") {
            navigate("/admin")
        } else {
            return
        }
    }, [userType, navigate]);

    useEffect(() => {
        loadChamadosCancelados()
    }, [user.uid]);

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
            <Title>Chamados Cancelados</Title>

            {chamadosCancelados.length === 0 ? (
                <div className="chamadosEmpty">
                    <h1>Nenhum chamado cancelado encontrado.</h1>
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
                        {chamadosCancelados.map((chamado, index) => (
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Content>
    )
}
