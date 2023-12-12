import "./chamadoDetails.css"
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { SideBar } from "../../components/layout/Sidebar"

//Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useLoadChamados } from "../../hooks/useLoadChamados";
import { useHandleCancelChamado } from "../../hooks/useHandleCancelChamado";

//Icons and Components
import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import { ChamadoStatus } from "../../components/styled/chamadoStatus"

import Viewer from "react-viewer";


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
    const { handleCancelChamado } = useHandleCancelChamado()

    // Images
    const imagesTypeAccepted = ["jpeg", "jpg", "png", "gif"] // Adicionar mais tipos de imagens aqui caso necessário...
    const [showImage, setShowImage] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);

    useEffect(() => {
        loadChamadoById(id)
    }, [user.uid]);

    useEffect(() => {
        // Filtra apenas os arquivos de imagem e vídeo e os converte para o formato esperado pelo Viewer
        const preparedViewerImages = files.map((file, index) => ({
            src: file,
            alt: `File ${index + 1}`,
            type: imagesTypeAccepted.includes(getTypeFile(file)) ? 'image' : 'video',
        }));
        setViewerImages(preparedViewerImages);
    }, [files]);

    // Pegar o tipo de arquivo
    function getTypeFile(url) {
        const parsedUrl = new URL(url);
        const filePath = parsedUrl.pathname;
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return fileExtension;
    }

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

                        {files.length !== 0 ? (
                            <section className="chamado-details-files">
                                {files.map((file, index) => (
                                    <div key={index}>
                                        {imagesTypeAccepted.includes(getTypeFile(file)) ? (
                                            <div onClick={() => setShowImage(true)} style={{ cursor: "pointer" }}>
                                                <img src={file} alt={`File ${index + 1}`} className="image-preview" />
                                            </div>
                                        ) : (
                                            <div>
                                                <video width="100%" height={200} src={file} controls />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <section className="chamado-details-files">
                                <p style={{ color: "gray" }}> Você não tem nenhum aquivo a ser mostrado...</p>
                            </section>
                        )}

                        {/* Visualizador de imagens */}
                        <Viewer
                            visible={showImage} onClose={() => setShowImage(false)}
                            images={viewerImages}
                            drag={false}
                            loop={false}
                            rotatable={false}
                            scalable={false}
                        />

                        <div className="chamado-details-actions">
                            <Tooltip title="Cancelar">
                                <span>
                                    <Button variant="contained"
                                        disabled={status === "aberto" ? false : true}
                                        color="error" size="large" className="action"
                                        onClick={() => handleCancelChamado(id)}
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