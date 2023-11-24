import './novoChamado.css';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { auth, db, storage } from '../../services/connectionFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { toast } from 'react-toastify';
import { Content } from '../../components/layout/Content';
import { Box, Button, TextField } from '@mui/material';

export default function NovoChamado() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [files, setFiles] = useState([]);
    const [displayOverlay, setDisplayOverlay] = useState(true);
    const chamadosCollection = collection(db, "chamados");

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*, video/*' // Aceita só imagens (até o momento)
    });

    const closeOverlay = () => {
        setDisplayOverlay(false);
    };

    async function handleUploadFiles() {
        const currentUser = auth.currentUser;

        if (currentUser && files.length > 0) {
            for (const file of files) {
                // Lógica de upload de arquivos
                const fileName = `${currentUser.uid}_${Date.now()}_${file.name}`;
                const storageRef = ref(storage, `chamadoFiles/${currentUser.uid}/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                const fileURLs = []

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Pode colocar alguma lógica aqui também
                    },
                    (error) => {
                        toast.error("Erro no upload do arquivo!!");
                        console.log("Erro no upload do arquivo", error);
                    },
                    async () => {
                        try {
                            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                            fileURLs.push(fileURL);

                            if (fileURLs.length === files.length) {
                                await addDoc(chamadosCollection, {
                                    titulo: titulo,
                                    descricao: descricao,
                                    fileURLs: fileURLs,
                                    userID: currentUser.uid,
                                    resposta: "",
                                });
                            }

                            setTitulo("");
                            setDescricao("");
                            setFiles([]);

                            toast.success("Chamado Enviado com sucesso!");
                        } catch (error) {
                            toast.warning("Erro ao adicionar o Chamado!");
                            console.log("Erro ao adicionar o Chamado: ", error);
                        }
                    }
                );
            }
            // Limpeza dos arquivos após o upload
            setFiles([]);
        } else {
            toast.warning("Nenhum arquivo selecionado para upload.");
        }
    }

    async function handleSubmitChamado(e) {
        e.preventDefault();

        const currentUser = auth.currentUser;

        if (files.length != 0) {
            handleUploadFiles()
            return
        }

        try {
            const chamadoData = {
                titulo: titulo,
                descricao: descricao,
                userID: currentUser ? currentUser.uid : '',
                resposta: ""
            };

            // Verifica se há conteúdo nos campos de texto (título ou descrição)
            if (titulo.trim() !== '' || descricao.trim() !== '') {
                await addDoc(chamadosCollection, chamadoData);
                toast.success("Chamado Enviado com sucesso!");

                setTitulo("");
                setDescricao("");
            } else {
                toast.warning("Preencha pelo menos o título ou a descrição.");
            }
        } catch (error) {
            toast.error("Erro ao adicionar o chamado!!");
            console.log("Erro ao adicionar o Chamado: ", error);
        }
    }

    return (
        <Content className="new-chamado-container">

            {displayOverlay && (
                <div className='overlay'>
                    <div className='overlay-content'>
                        <p>Sinta-se seguro ao fazer sua demanda, você está totalmente anônimo e protegido.</p>
                        <button onClick={closeOverlay} className='close-button'>x</button>
                    </div>
                </div>
            )}

            <Box component="form" className='formulario-chamado' onSubmit={handleSubmitChamado}>

                <h1>Novo chamado</h1>

                <div className="formulario-inputs">
                    <TextField
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        type='text'
                        autoComplete="false"
                        label='Digite o título da sua denúncia' />

                    <TextField
                        value={descricao}
                        multiline
                        autoComplete="false"
                        maxRows={45}
                        minRows={5}
                        onChange={(e) => setDescricao(e.target.value)}
                        label='Digite aqui a descrição da sua denúncia' />

                    <div {...getRootProps()} className='dropzone'>

                        <input {...getInputProps()} />
                        {files.length === 0 ? (
                            <p>Arraste e solte os arquivos, ou clique para selecionar (Opcional)</p>
                        ) : null}
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
                <Button size="large" variant="contained" className="btn-enviar" type='submit'>Enviar Chamado</Button>
            </Box>
        </Content>
    );
}