import "./adminChamados.css"
import { useContext, useEffect } from "react"
import { Link, useParams } from "react-router-dom";

// Material UI
import { Backdrop, CircularProgress, IconButton, Tooltip } from "@mui/material";

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { ChamadoStatus } from "../../components/styled/chamadoStatus";

// Icons
import { CgDetailsMore } from "react-icons/cg"

// Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useCheckUserType } from "../../utils/useCheckUserType";
import { useLoadChamadosAdmin } from "../../utils/loadChamadosNaoRespondidos";


export default function Admin() {

    const { chamadosNaoRespondidos, loadChamadosNaoRespondidos, loadingChamados } = useLoadChamadosAdmin();

    const { checkUserType, loadingAdmin } = useCheckUserType()
    const { user } = useContext(AuthContext)
    const { statusPage } = useParams()
    let statusTitle = ""

    useEffect(() => {
        checkUserType(user.uid, "/meus-chamados")
    }, [user.uid]);

    useEffect(() => {
        loadChamadosNaoRespondidos(statusPage)
    }, [statusPage]);


    if (loadingAdmin) {
        return (
            <Backdrop open>
                <CircularProgress color="secondary" />
            </Backdrop>
        )
    }

    if (loadingChamados) {
        return (
            <Content className="loading-container">
                <Title>Carregando...</Title>
                <div>
                    <CircularProgress />
                </div>
            </Content>
        )
    }

    switch (statusPage) {
        case "aberto":
            statusTitle = "Em Aberto"
            break
        case "andamento":
            statusTitle = "Em Andamento"
            break
        case "finalizado":
            statusTitle = "Finalizados"
            break
        case "arquivado":
            statusTitle = "Arquivados"
            break
        default:
            statusTitle = ""
            break
    }

    return (
        <Content className="chamados-container">
            <Title>
                {statusTitle}
            </Title>

            <section className="cards-chamados-container">
                {chamadosNaoRespondidos.length === 0 ? (
                    <div className="zero-chamados">
                        <h3>Nenhum chamado foi encontrado!</h3>
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
                            {chamadosNaoRespondidos && chamadosNaoRespondidos.map((chamado, index) => (
                                <tr key={index}>
                                    <td data-label="ID">{chamado.newID}</td>
                                    <td data-label="Titulo">{chamado.titulo}</td>
                                    <td data-label="Descrição">{chamado.descricao}</td>
                                    <td data-label="Status">
                                        <ChamadoStatus status={chamado.status} />
                                    </td>
                                    <td data-label="Resposta">
                                        <span>{chamado.resposta === "" ? "..." : chamado.resposta}</span>
                                    </td>
                                    <td className="actions" data-label="Ações">
                                        <Link to={`/admin/${chamado.status}/${chamado.id}`}>
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
            </section>
        </Content>
    )
}