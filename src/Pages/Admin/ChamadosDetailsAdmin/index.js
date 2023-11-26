import "./chamadoDetailsAdmin.css"
import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'

// Local Components
import { Content } from "../../../components/layout/Content";
import { Title } from "../../../components/layout/Title";
import { SideBarAdmin } from "../../../components/layout/sidebar";

//Utils
import { AuthContext } from "../../../contexts/AuthContext";
import { useHandleDeleteChamado } from '../../../utils/useHandleDeleteChamado';
import { useLoadChamados } from "../../../utils/useLoadChamados";

//Icons and Components
import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import { ChamadoStatus } from "../../../components/styled/chamadoStatus"


export default function ChamadosDetailsAdmin() {

    const { id, statusPage } = useParams()
    const { user } = useContext(AuthContext);
    const { loadChamadoById,
        newID,
        status,
        descricao,
        titulo,
        resposta,
        files,
        loadingChamadoById,
    } = useLoadChamados()
    const { handleDeleteChamado } = useHandleDeleteChamado()

    useEffect(() => {
        loadChamadoById(id)
    }, [user.uid]);


    if (loadingChamadoById) {
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
            <SideBarAdmin />
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

                        {resposta === "" && <span className="alert-resposta">Esse chamado ainda não foi respondido.</span>}

                        {files ? (
                            <section className="chamado-details-files">
                                {files.map((file, index) => (
                                    <div key={index}>
                                        <img width={300} src={file} alt={`chamado ${index}`} />
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <section className="chamado-details-files">
                                <p style={{ color: "red" }}> Você não tem nenhum aquivo a ser mostrado...</p>
                            </section>
                        )}

                        <section className="actions">

                        </section>
                    </section>
                </Box>
            </Content>
        </>
    )
}