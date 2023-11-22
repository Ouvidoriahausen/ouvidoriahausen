import './novoChamado.css';
import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { auth, db, storage } from '../../services/connectionFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function NovoChamado() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [files, setFiles] = useState([]);
    const [displayOverlay, setDisplayOverlay] = useState(true);
    const { logout } = useContext(AuthContext)

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' // Aceita só imagens (até o momento)
    });

    const closeOverlay = () => {
        setDisplayOverlay(false);
    };

    async function handleSubmitChamado(e) {
        e.preventDefault()

        const currentUser = auth.currentUser;
        const chamadosCollection = collection(db, "chamados")
        const fileURLs = []

        if (currentUser && files.length > 0) {
            for (const file of files) {

                // Gera um nome unico para cada arquivo, usando o id do usuario e a data atual
                const fileName = `${currentUser.uid}_${Date.now()}_${file.name}`

                const storageRef = ref(storage, `chamadoFiles/${currentUser.uid}/${fileName}`)
                const uploadTask = uploadBytesResumable(storageRef, file)

                uploadTask.on("state_changed",
                    (snapshot) => {
                        // Pode colocar alguma lógica aqui também
                    }, (error) => {
                        toast.error("Erro no upload do arquivo!!")
                        console.log("Erro no upload do arquivo", error)
                    },
                    async () => {

                        try {
                            // Pega o URL do arquivo dps do upload
                            const fileURL = await getDownloadURL(uploadTask.snapshot.ref)
                            fileURLs.push(fileURL)

                            if (fileURLs.length === files.length) {
                                await addDoc(chamadosCollection, {
                                    titulo: titulo,
                                    descricao: descricao,
                                    fileURLs: fileURLs,
                                    userID: currentUser.uid,
                                    resposta: "",
                                })
                            }

                            toast.success("Chamado Enviado com sucesso!")

                            // Limpa os campos de input
                            setTitulo("")
                            setDescricao("")
                            setFiles([])

                        } catch (error) {
                            toast.error("Erro ao adicionar o chamado!!")
                            console.log("Erro ao adicionar o Chamado: ", error)
                        }
                    }
                )
            }
        }
    }

    return (
        <div className='chamado-container'>
            {displayOverlay && (
                <div className='overlay'>
                    <div className='overlay-content'>
                        <p>Sinta-se seguro ao fazer sua demanda, você está totalmente anônimo e protegido.</p>
                        <button onClick={closeOverlay} className='close-button'>x</button>
                    </div>
                </div>
            )}

            <form className='formulario-chamado' onSubmit={handleSubmitChamado}>

                <h1>Nova Demanda</h1>

                <div className="formulario-inputs">
                    <input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className='input_titulo' type='text' placeholder='Digite o título da sua denúncia' />

                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className='input_descricao' placeholder='Digite aqui a descrição da sua denúncia'></textarea>

                    <div {...getRootProps()} className='dropzone'>

                        <input {...getInputProps()} />
                        {files.length === 0 ? (
                            <p>Arraste e solte os arquivos, ou clique para selecionar</p>
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
                <button className='botao-submit' type='submit'>Enviar</button>
            </form>

            <div>
                <Link className='btn-mychamados' to="/meus-chamados">Acessar Meus Chamados</Link>
            </div>

            <div className='logout'>
                <Link className='logout-btn' onClick={logout} to="/">Sair</Link>
            </div>
        </div>
    );
}