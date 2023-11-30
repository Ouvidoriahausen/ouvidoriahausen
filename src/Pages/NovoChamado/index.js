import './novoChamado.css';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { auth, db, storage } from '../../services/connectionFirebase';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { toast } from 'react-toastify';
import { Content } from '../../components/layout/Content';
import { Box, Button, TextField } from '@mui/material';
import { Title } from '../../components/layout/Title';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useUserType } from '../../hooks/useUserType';

export default function NovoChamado() {
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [status, setStatus] = useState("aberto")
    const [files, setFiles] = useState([]);

    const [loading, setLoading] = useState(false);
    const chamadosCollection = "chamados"

    const userType = useUserType()
    const navigate = useNavigate()

    // Verificação de usuário
    useEffect(() => {
        if (userType !== "comum") {
            navigate("/admin")
        }
    }, [userType, navigate]);

    // Dropzone
    const onDrop = useCallback(acceptedFiles => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
    }, []);


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
            "video/*": [".mp4", ".mov", ".mkv", ".avi"]
        }
    });

    async function handleUploadFiles(chamadoData) {
        setLoading(true)

        try {

            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('Usuário não autenticado.');

            const chamadosCollectionRef = collection(db, chamadosCollection);
            const newDocRef = await addDoc(chamadosCollectionRef, chamadoData);
            const newChamadoId = newDocRef.id;

            if (files.length > 0) {
                const promises = files.map(async (file) => {
                    const fileName = `${currentUser.uid}_${file.name}`;
                    const storageRef = ref(storage, `chamadoFiles/${currentUser.uid}/${newChamadoId}/${fileName}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                // Pode colocar alguma lógica aqui também
                            },
                            async (error) => {
                                reject(error);
                            },
                            async () => {
                                try {
                                    const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                                    const chamadoDocRef = doc(db, chamadosCollection, newChamadoId);

                                    const updatedFileURLs = chamadoData.fileURLs || [];
                                    updatedFileURLs.push(fileURL);

                                    await updateDoc(chamadoDocRef, { fileURLs: updatedFileURLs });

                                    resolve();
                                } catch (error) {
                                    reject(error);
                                }
                            }
                        );
                    });
                });

                await Promise.all(promises);
            }

            setFiles([]);
            toast.success("Chamado Enviado com sucesso!");
        } catch (error) {
            toast.error("Erro ao adicionar o chamado e enviar arquivos.");
            console.log("Erro ao adicionar o chamado e enviar arquivos: ", error);
        }
        finally {
            setLoading(false)
        }
    }

    async function handleSubmitChamado(e) {
        e.preventDefault();

        const currentUser = auth.currentUser;

        // Criar ID personalizado para o chamado
        const q = query(collection(db, chamadosCollection), orderBy('newID', 'desc'), limit(1));

        const querySnapshot = await getDocs(q);
        let ultimoNumero = 0;

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                // Obtém o último número do último chamado existente
                const ultimoChamado = doc.data();
                const ultimoId = ultimoChamado.newID;
                const ultimoNumeroString = ultimoId.split('-')[1];
                ultimoNumero = parseInt(ultimoNumeroString);
            });
        }

        // Incrementa o número para o próximo chamado
        const proximoNumero = ultimoNumero + 1;

        const anoAtual = new Date().getFullYear();
        const numeroFormatado = String(proximoNumero).padStart(4, '0');
        const idPersonalizado = `${anoAtual}-${numeroFormatado}`;



        try {
            const chamadoData = {
                newID: idPersonalizado,
                titulo: titulo,
                descricao: descricao,
                userID: currentUser ? currentUser.uid : '',
                resposta: "",
                fileURLs: [],
                status: status,
                created: new Date(),
            };

            if (files.length !== 0) {
                await handleUploadFiles(chamadoData)
            } else {
                await addDoc(collection(db, chamadosCollection), chamadoData)
                setFiles([])
                setLoading(false)
                toast.success("Chamado Enviado com sucesso!");
            }

            setTitulo("");
            setDescricao("");

        } catch (error) {
            toast.error("Erro ao adicionar o chamado!!");
            console.log("Erro ao adicionar o Chamado: ", error);
            setLoading(false)
        }
    }

    return (
        <Content className="new-chamado-container">
            <Title>Novo Chamado</Title>

            <section className="form-container">
                <Box component="form" className='formulario-chamado' onSubmit={handleSubmitChamado}>

                    <div className="formulario-inputs">
                        <TextField
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            type='text'
                            required
                            maxLength={30}
                            autoComplete="false"
                            label='Digite o título da sua denúncia' />

                        <TextField
                            value={descricao}
                            multiline
                            autoComplete="false"
                            maxRows={45}
                            minRows={5}
                            required
                            onChange={(e) => setDescricao(e.target.value)}
                            label='Digite aqui a descrição da sua denúncia' />

                        <div {...getRootProps()} className='dropzone'>


                            {files.length === 0 ?
                                (
                                    <>
                                        <AiOutlineCloudUpload size={40} />
                                        Enviar arquivos
                                    </>
                                ) : null}
                            <input {...getInputProps()} className="input-files" type="file" />

                            <aside className="thumbs-container">
                                {files.map(file => (
                                    <div key={file.name}>
                                        {file.type.startsWith('image/') ? (
                                            <img src={file.preview} alt={file.name} className="image-preview" />
                                        ) : (
                                            <video src={file.preview} className="video-preview" controls />
                                        )}
                                    </div>
                                ))}
                            </aside>
                        </div>
                    </div>
                    {loading ? (
                        <LoadingButton loading size="large" variant="contained" className="btn-enviar">
                            Loading...
                        </LoadingButton>
                    ) : (
                        <>
                            <Button size="large" variant="contained" className="btn-enviar" type="submit">
                                Enviar Chamado
                            </Button>
                            <span style={{ textAlign: "center", margin: "12px 0", color: "red" }}>
                                Seu chamado terá 5 dias úteis para ser respondido.
                            </span>
                        </>
                    )}
                </Box>
            </section>
        </Content>
    );
}