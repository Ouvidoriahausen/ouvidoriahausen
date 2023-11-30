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
import { Box, Button, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import { ChamadoStatus } from "../../../components/styled/chamadoStatus"
import { toast } from "react-toastify";
import { useUserType } from "../../../hooks/useUserType";


export default function ChamadosDetailsAdmin() {

    const { id } = useParams()
    const { user } = useContext(AuthContext);
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
    } = useLoadChamados()

    const navigate = useNavigate()
    const userType = useUserType()

    // Verificação de usuário
    useEffect(() => {
        if (userType === "comum") {
            navigate("/meus-chamados")
        }
    }, [userType, navigate]);

    useEffect(() => {
        loadChamadoById(id)
    }, [user.uid]);


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
        })
            .then(() => {
                toast.success("Chamado atualizado com sucesso!")
                setResposta("")
                setStatus("")
                navigate(`/admin/${statusURL}/${id}`)
                window.location.reload()
            })
            .catch(() => {
                toast.error("Erro ao atualizar o chamado!")
                setResposta("")
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

                    {files ? (
                        <section className="chamado-details-admin-files">
                            {files.map((file, index) => (
                                <div key={index}>
                                    <img width={300} src={file} alt={`chamado ${index}`} />
                                </div>
                            ))}
                        </section>
                    ) : (
                        <section className="chamado-details-admin-files">
                            <p style={{ color: "red" }}> Você não tem nenhum aquivo a ser mostrado...</p>
                        </section>
                    )}

                    <span className="divider" style={{ borderColor: "var(--medium-gray)" }} />

                    <section className="chamado-details-admin-actions">
                        <div className="action-radio-input">
                            <span>Alterar status: </span>

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

                        <div className="action-button-submit">
                            <Button variant="contained" fullWidth size="large" onClick={() => handleUpdateChamado()}>Enviar</Button>
                        </div>
                    </section>
                </section>
            </Box>
        </Content>
    )
}