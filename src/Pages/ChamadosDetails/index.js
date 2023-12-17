import "./chamadoDetails.css"
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';

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

import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../services/connectionFirebase";

import Viewer from "react-viewer";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { LoadingButton } from "@mui/lab";

export default function ChamadosDetails() {

    const chamadosCollection = "chamados"
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
        respostaDetails,
        setRespostaDetails,
    } = useLoadChamados()
    const { handleCancelChamado } = useHandleCancelChamado()
    const [filesMoreD, setFilesMoreD] = useState([])
    const [loading, setLoading] = useState(false)

    // Images
    const imagesTypeAccepted = ["jpeg", "jpg", "png", "gif"] // Adicionar mais tipos de imagens aqui caso necessário...
    const [showImage, setShowImage] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);


    useEffect(() => {
        loadChamadoById(id)
    }, [user.uid]);

    // Dropzone
    const onDrop = useCallback((acceptedFiles) => {
        setFilesMoreD((prevFiles) => [
            ...prevFiles,
            ...acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            ),
        ]);
    }, []);


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
            "video/*": [".mp4", ".mov", ".mkv", ".avi"]
        }
    });

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

    async function handleUploadFiles(chamadoId) {
        setLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('Usuário não autenticado.');

            if (filesMoreD.length > 0) {
                console.log("Arquivos a serem enviados:", filesMoreD);

                const updatedFileURLs = [];

                for (const file of filesMoreD) {
                    const fileName = `${currentUser.uid}_${file.name}`;
                    const storageRef = ref(storage, `chamadoFilesMoreDetails/${currentUser.uid}/${chamadoId}/${fileName}`);

                    // Faz o upload do arquivo para o Firebase Storage
                    const snapshot = await uploadBytesResumable(storageRef, file);

                    // Obtém o URL de download do arquivo
                    const fileURL = await getDownloadURL(snapshot.ref);

                    // Adiciona o URL de download à lista de URLs
                    updatedFileURLs.push(fileURL);
                }

                console.log("URLs dos arquivos:", updatedFileURLs);

                // Atualiza os URLs de download no Firestore
                const chamadoDocRef = doc(db, chamadosCollection, chamadoId);
                await updateDoc(chamadoDocRef, { filesMoreDetails: updatedFileURLs });
            }

            setFilesMoreD([]);
        } catch (error) {
            toast.error("Erro ao enviar arquivos.");
            console.log("Erro ao enviar arquivos: ", error);
        } finally {
            setLoading(false);
        }
    }




    async function handleSubmitMoreDetails() {
        if (respostaDetails === "") {
            toast.info("Por favor, envie os detalhes corretamente.")
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('Usuário não autenticado.');

            const chamadoDocRef = doc(db, chamadosCollection, id);
            const chamadoSnapshot = await getDoc(chamadoDocRef);
            const chamadoData = chamadoSnapshot.data();

            // Obtém os links existentes
            const existingFilesMoreDetails = chamadoData.filesMoreDetails || [];

            // Faz o upload dos novos arquivos (se houver)
            if (filesMoreD.length > 0) {
                const updatedFileURLs = [];

                for (const file of filesMoreD) {
                    const fileName = `${currentUser.uid}_${file.name}`;
                    const storageRef = ref(storage, `chamadoFilesMoreDetails/${currentUser.uid}/${id}/${fileName}`);

                    // Faz o upload do arquivo para o Firebase Storage
                    const snapshot = await uploadBytesResumable(storageRef, file);

                    // Obtém o URL de download do arquivo
                    const fileURL = await getDownloadURL(snapshot.ref);

                    // Adiciona o URL de download à lista de URLs atualizados
                    updatedFileURLs.push(fileURL);
                }

                // Adiciona os novos links aos links existentes
                const updatedFilesMoreDetails = [...existingFilesMoreDetails, ...updatedFileURLs];

                // Atualiza os novos URLs de download no Firestore
                await updateDoc(chamadoDocRef, {
                    status: "andamento",
                    respostaDetails: respostaDetails,
                    filesMoreDetails: updatedFilesMoreDetails
                });

                // Limpa o estado de filesMoreD após o upload
                setFilesMoreD([]);
            } else {
                // Se não houver novos arquivos, atualiza apenas os detalhes da resposta
                await updateDoc(chamadoDocRef, {
                    status: "andamento",
                    respostaDetails: respostaDetails
                });
            }

            toast.success("Resposta enviada com sucesso!");

            setRespostaDetails("");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            toast.error("Erro ao enviar a resposta!");
            setRespostaDetails("");
            console.error(error);
        }
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

                        {status === "andamento" && <span style={{ color: "red", marginTop: "16px" }}>Seu chamado será respondido em até 5 dias úteis, por favor aguarde.</span>}


                        {status === "detalhes" && (
                            <section className="moreDetails-container">
                                <div className="chamado-user-detalhes">
                                    <span>Precisa de mais detalhes:</span>
                                    <h4>{moreDetails}</h4>
                                </div>

                                <span style={{ color: "red" }}>Seu chamado será respondido em até 5 dias úteis, por favor aguarde.</span>

                                <TextField
                                    multiline
                                    fullWidth
                                    value={respostaDetails}
                                    onChange={(e) => setRespostaDetails(e.target.value)}
                                    placeholder="Informe aqui os detalhes necessários para resolver seu problema..."
                                />

                                <div {...getRootProps()} className="dropzone">
                                    {filesMoreD.length === 0 ?
                                        (
                                            <>
                                                <AiOutlineCloudUpload size={40} />
                                                Enviar arquivos
                                            </>
                                        ) : null}

                                    <input {...getInputProps()} className="input-files" type="file" />

                                    <aside className="thumbs-container">
                                        {filesMoreD.map(file => (
                                            <div key={file.name}>
                                                {file.type.startsWith("image/") ? (
                                                    <img src={file.preview} alt={file.name} className="image-preview" />
                                                ) : (
                                                    <video src={file.preview} className="video-preview" controls />
                                                )}
                                            </div>
                                        ))}
                                    </aside>
                                </div>

                                {loading ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <LoadingButton loading size="large" variant="contained" className="btn-enviar">
                                            Loading...
                                        </LoadingButton>

                                        <span style={{ color: "red", textAlign: "center" }}>Não atualizar a página enquanto o upload seja feito.</span>
                                    </div>
                                ) : (
                                    <Button onClick={handleSubmitMoreDetails} size="large" variant="contained" className="btn-enviar" type="submit">
                                        Enviar Resposta
                                    </Button>
                                )}

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