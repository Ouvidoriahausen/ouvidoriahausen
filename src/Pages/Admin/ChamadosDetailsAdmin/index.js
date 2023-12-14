import "./chamadoDetailsAdmin.css"
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/connectionFirebase";

// Local Components
import { Content } from "../../../components/layout/Content";
import { Title } from "../../../components/layout/Title";

//Utils
import { AuthContext } from "../../../contexts/AuthContext";
import { useLoadChamados } from "../../../hooks/useLoadChamados";

//Icons and Components
import { Box, Button, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { ChamadoStatus } from "../../../components/styled/chamadoStatus"
import { toast } from "react-toastify";

import Viewer from "react-viewer";

export default function ChamadosDetailsAdmin() {

    const { id } = useParams()
    const { user } = useContext(AuthContext);
    const navigate = useNavigate()
    const { loadChamadoById,
        newID,
        status,
        descricao,
        titulo,
        resposta,
        files,
        loadingChamados,
        setResposta,
        setStatus,
        moreDetails,
        setMoreDetails,
        respostaDetails,
    } = useLoadChamados()

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

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    const statusURL = status.toLowerCase()

    async function handleUpdateChamado(e) {
        const docRef = doc(db, "chamados", id)
        await updateDoc(docRef, {
            status: status,
            resposta: resposta,
            moreDetails: moreDetails,
            respostaDetails: respostaDetails,
        })
            .then(() => {
                toast.success("Chamado atualizado com sucesso!")
                setResposta("")
                setStatus("")
                setMoreDetails("")
                navigate(`/admin/${statusURL}/${id}`)
                window.location.reload()
            })
            .catch(() => {
                toast.error("Erro ao atualizar o chamado!")
                setResposta("")
                setMoreDetails("")
                setStatus("")
            })
    }

    return (

        <Content className="chamado-details-admin-container">
            <Title>Chamado {newID}</Title>

            <Box className="chamado-details-admin-main">
                <section className="chamado-details-admin">
                    <div className="chamado-details-admin-title">
                        <h3>{titulo}</h3>
                        <p>ID: {newID}</p>
                    </div>
                    <div className="chamado-details-admin-description">
                        <p>Descrição: </p>
                        <h4>{descricao}</h4>
                    </div>

                    <div className="chamado-details-admin-status">
                        <p>Status:</p>
                        <ChamadoStatus status={status} />
                    </div>

                    <div className="chamado-details-admin-resposta">
                        <p>Resposta:</p>
                        <h4>{resposta === "" ? "..." : resposta}</h4>
                    </div>

                    {resposta === "" && <span className="alert-resposta">Esse chamado ainda não foi respondido.</span>}

                    {moreDetails && <div className="chamado-details-admin-detalhes">
                        <span>Mais detalhes: (Descrito por um admin.)</span>
                        <h4>{moreDetails}</h4>
                    </div>}

                    {respostaDetails && <div className="chamado-details-admin-detalhes2">
                        <span>Resposta dada pelo usuário:</span>
                        <h4>{respostaDetails}</h4>
                    </div>}


                    {files.length === 0 ? (
                        <section className="chamado-details-admin-files">
                            <p style={{ color: "gray" }}> Este chamado não tem nenhum aquivo a ser mostrado...</p>
                        </section>
                    ) : (
                        <section className="chamado-details-admin-files">

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

                    <span className="divider" style={{ borderColor: "var(--medium-gray)" }} />

                    <section className="chamado-details-admin-actions">
                        <div className="action-radio-input">
                            <span className="action-title">Alterar status: </span>

                            <RadioGroup className="radio-group" value={status} onChange={handleOptionChange}>

                                <FormControlLabel value="aberto" control={<Radio />}
                                    label="Em aberto"
                                />
                                <FormControlLabel value="andamento" control={<Radio />}
                                    label="Em andamento"
                                />

                                <FormControlLabel value="finalizado" control={<Radio />}
                                    label="Finalizado"
                                />
                                <FormControlLabel value="arquivado" control={<Radio />}
                                    label="Arquivado"
                                />

                            </RadioGroup>
                        </div>

                        <div className="action-resposta-input">
                            <TextField fullWidth placeholder="Escreva uma resposta..."
                                multiline
                                value={resposta}
                                onChange={(e) => setResposta(e.target.value)}
                            />
                        </div>

                        <span className="divider" style={{ borderColor: "var(--medium-gray)" }} />

                        <div className="action-radio-input">
                            <span className="action-title">Mais Opções: </span>
                            <div className="form-more-details">
                                <RadioGroup className="radio-group" value={status} onChange={handleOptionChange}>
                                    <FormControlLabel value="detalhes" control={<Radio />}
                                        label="Precisa de detalhes"
                                    />

                                    {status === "detalhes" && <TextField
                                        fullWidth
                                        placeholder="Especifique os detalhes necessários"
                                        multiline
                                        minRows={3}
                                        sx={{ background: "#fff" }}
                                        onChange={(e) => setMoreDetails(e.target.value)}
                                    />}
                                </RadioGroup>

                            </div>
                        </div>

                        <div className="action-button-submit">
                            <Button variant="contained" fullWidth size="large" onClick={() => handleUpdateChamado()}>Enviar</Button>
                        </div>
                    </section>
                </section>
            </Box>
        </Content>
    )
}