import './ticket.css';
import React, { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { auth, db } from '../../services/connectionFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Ticket() {
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
        accept: 'image/*,video/*' // Aceita tanto imagens quanto vídeos
    });

    const closeOverlay = () => {
        setDisplayOverlay(false);
    };

    async function handleSubmitTicket(e) {
        e.preventDefault()

        const storage = getStorage()
        const currentUser = auth.currentUser;
        const ticketsCollection = collection(db, "Tickets")

        if (currentUser && files) {
            for(const file of files){

                // Gera um nome unico para cada arquivo, usando o id do usuario e a data atual
                const fileName = `${currentUser.uid}_${Date.now()}_${file.name}`

                const storageRef = ref(storage, `ticketFiles/${currentUser.uid}/${fileName}`)
                const uploadTask = uploadBytesResumable(storageRef, files)
    
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
    
                            await addDoc(ticketsCollection, {
                                titulo: titulo,
                                descricao: descricao,
                                fileURL,
                                userID: currentUser.uid,
                                resposta: "",
                            })

                            toast.success("Ticket Enviado com sucesso!")
    
                            // Limpa os campos de input
                            setTitulo("")
                            setDescricao("")
                            setFiles([])
                        } catch (error) {
                            toast.error("Erro ao adicionar o ticket!!")
                            console.log("Erro ao adicionar o Ticket: ", error)
                        }
                    }
                )
            }
        }
    }

    return (
        <div className='ticket-container'>
            {displayOverlay && (
                <div className='overlay'>
                    <div className='overlay-content'>
                        <p>Sinta-se seguro ao fazer sua denúncia, você está totalmente anônimo e protegido.</p>
                        <button onClick={closeOverlay} className='close-button'>x</button>
                    </div>
                </div>
            )}

            <form className='formulario-ticket' onSubmit={handleSubmitTicket}>

                <h1>Formulário de denúncia</h1>

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
                <Link className='btn-myTickets' to="/MeusTickets">Acessar Meus Tickets</Link>
            </div>

            <div className='logout'>
                <Link className='logout-btn' onClick={logout} to="/MeusTickets">Sair</Link>
            </div>
        </div>
    );
}

export default Ticket;