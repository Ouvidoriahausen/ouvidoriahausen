import "./adminChamados.css"
import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation, Link, useParams } from "react-router-dom";
import { useCheckUserType } from "./utils/checkUserType";
import { CircularProgress } from "@mui/material";
import { SideBarAdmin } from "../../components/layout/sidebar";
import { IconButton, Tooltip } from '@mui/material'
import { useLoadChamados } from "./utils/loadChamadosNaoRespondidos"
import { CgDetailsMore } from "react-icons/cg"
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { ChamadoStatus } from "../../components/styled/chamadoStatus";


export default function Admin({ pageTitle }) {

    const { chamadosNaoRespondidos, loadChamadosNaoRespondidos, loadingChamados } = useLoadChamados();

    const { checkUserType, loadingAdmin } = useCheckUserType()
    const { user } = useContext(AuthContext)
    const { statusPage } = useParams()

    useEffect(() => {
        checkUserType(user.uid)
    }, [user.uid]);

    useEffect(() => {
        loadChamadosNaoRespondidos(statusPage);
    }, [statusPage]);


    if (loadingAdmin) {
        return (
            <div className="loading-full">
                <CircularProgress color="secondary" />
            </div>
        )
    }

    if (loadingChamados) {
        return (
            <>
                <SideBarAdmin />
                <Content className="loading-container">
                    <Title>Carregando...</Title>
                    <div>
                        <CircularProgress />
                    </div>
                </Content>
            </>

        )
    }


    return (
        <>
            <SideBarAdmin />
            <Content className="chamados-container">
                <Title>
                    {statusPage.replace("-", " ").charAt(0).toUpperCase() + statusPage.replace("-", " ").slice(1)}
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
                                            <Link to={`/admin/${chamado.status.replace(" ", "-")}/${chamado.id}`}>
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
        </>
    )
}