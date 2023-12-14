import "./chamadoDetails.css"
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

// Local Components
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { SideBar } from "../../components/layout/Sidebar"

//Utils
import { AuthContext } from "../../contexts/AuthContext";
import { useLoadChamados } from "../../hooks/useLoadChamados";
import { useHandleCancelChamado } from "../../hooks/useHandleCancelChamado";

//Icons and Components
import { Box, Button, CircularProgress, TextField, Tooltip } from "@mui/material";
import { ChamadoStatus } from "../../components/styled/chamadoStatus"

import Viewer from "react-viewer";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/connectionFirebase";


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
        moreDetails,
        loadingChamados,
        setStatus,
        respostaDetails,
        setRespostaDetails,
    } = useLoadChamados()
    const { handleCancelChamado } = useHandleCancelChamado()
    const navigate = useNavigate()

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

    async function handleSubmitMoreDetails() {

        if(respostaDetails === ""){
            toast.info("Por favor, envie os detalhes corretamente.")
            return
        }

        const docRef = doc(db, "chamados", id)
        await updateDoc(docRef, {
            status: "andamento",
            respostaDetails: respostaDetails,
        })
            .then(() => {
                toast.success("Resposta enviada com sucesso!")
                setRespostaDetails("")
                window.location.reload()
            })
            .catch(() => {
                toast.error("Erro ao enviar a resposta!")
                setRespostaDetails("")
            })
    }

    return (
        <>
            <SideBar />
            <Content className="chamado-user-container">
                <Title>Chamado {newID}</Title>

                <Box className="chamado-user-main">
                    <section className="chamado-user">
                        <div className="chamado-user-title">
                            <h3>{titulo}</h3>
                            <p>ID: {newID}</p>
                        </div>
                        <div className="chamado-user-description">
                            <p>Descrição: </p>
                            <h4>{descricao}</h4>
                        </div>

                        <div className="chamado-user-status">
                            <p>Status:</p>
                            <ChamadoStatus status={status} />
                        </div>

                        {status !== "detalhes" && <div className="chamado-user-resposta">
                            <p>Resposta:</p>
                            <h4>{resposta === "" ? "..." : resposta}</h4>
                        </div>}


                        {status === "detalhes" && (
                            <section className="moreDetails-container">
                                <div className="chamado-user-detalhes">
                                    <span>Precisa de mais detalhes:</span>
                                    <h4>{moreDetails}</h4>
                                </div>

                                <TextField
                                    multiline
                                    fullWidth
                                    value={respostaDetails}
                                    onChange={(e) => setRespostaDetails(e.target.value)}
                                    placeholder="Informe aqui os detalhes necessários para resolver seu problema..."
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleSubmitMoreDetails}
                                >
                                    Enviar resposta
                                </Button>
                            </section>
                        )}



                        {files.length !== 0 ? (
                            <section className="chamado-user-files">
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
                            <section className="chamado-user-files">
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

                        <div className="chamado-user-actions">
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