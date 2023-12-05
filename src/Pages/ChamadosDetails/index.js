import "./chamadoDetails.css"
import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { SideBar } from "../../components/layout/Sidebar"

//Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useLoadChamados } from "../../hooks/useLoadChamados";
import { useHandleDeleteChamado } from '../../hooks/useHandleDeleteChamado';

//Icons and Components
import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import { ChamadoStatus } from "../../components/styled/chamadoStatus"
import { useUserType } from "../../hooks/useUserType";


export default function ChamadosDetails() {

    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const { loadChamadoById,
        newID,
        status,
        descricao,
        titulo,
        resposta,
        files,
        loadingChamados,
    } = useLoadChamados()
    const { handleDeleteChamado } = useHandleDeleteChamado()

    const userType = useUserType()
    const navigate = useNavigate()

    // Verificação de usuário
    useEffect(() => {
        if (userType === "admin" || userType === "master") {
            navigate("/")
        } else {
            return
        }
    }, [userType, navigate]);

    useEffect(() => {
        loadChamadoById(id)
    }, [user.uid, loadChamadoById, id]);


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
        <>
            <SideBar />
            <Content className="chamado-details-container">
                <Title>Chamado {newID}</Title>

                <Box className="chamado-details-main">
                    <section className="chamado-details">
                        <div className="chamado-details-title">
                            <h3>{titulo}</h3>
                            <p>ID: {newID}</p>
                        </div>
                        <div className="chamado-details-description">
                            <p>Descrição: </p>
                            <h4>{descricao}</h4>
                        </div>

                        <div className="chamado-details-status">
                            <p>Status:</p>
                            <ChamadoStatus status={status} />
                        </div>

                        <div className="chamado-details-resposta">
                            <p>Resposta:</p>
                            <h4>{resposta === "" ? "..." : resposta}</h4>
                        </div>

                        {/* {resposta === "" && <span className="alert-resposta">Seu chamado tem 5 dias úteis para ser respondido.</span>} */}

                        {files.length !== 0 ? (
                            <section className="chamado-details-files">
                                {files.map((file, index) => (
                                    <div key={index}>
                                        <img src={file} alt={`chamado ${index}`} />
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <section className="chamado-details-files">
                                <p style={{ color: "gray" }}> Você não tem nenhum aquivo a ser mostrado...</p>
                            </section>
                        )}

                        <div className="chamado-details-actions">
                            <Tooltip title="Cancelar">
                                <span>
                                    <Button variant="contained"
                                        disabled={status === "aberto" ? false : true}
                                        color="error" size="large" className="action"
                                        onClick={() => handleDeleteChamado(id)}
                                    >
                                        Cancelar chamado
                                    </Button>
                                </span>
                            </Tooltip>
                        </div>
                    </section>
                </Box>
            </Content>
        </>
    )
}