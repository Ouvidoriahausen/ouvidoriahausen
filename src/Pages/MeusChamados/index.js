import "./meusChamados.css"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash } from "react-icons/fi"
import { CgDetailsMore } from "react-icons/cg";
import { toast } from "react-toastify";

const listRef = collection(db, "chamados")

export default function MeusChamados() {

    const { user } = useContext(AuthContext);
    const [userChamados, setUserChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);


    useEffect(() => {
        async function loadChamados() {
            const q = query(collection(db, "chamados"), where("userID", "==", user.uid));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    let chamados = [];
                    querySnapshot.forEach((doc) => {
                        chamados.push({
                            id: doc.id,
                            newID: doc.data().newID,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            resposta: doc.data().resposta,
                        });
                    });
                    setUserChamados(chamados);
                    setIsEmpty(false)
                    setLoading(false)
                } else {
                    setIsEmpty(true);
                    setLoading(false)
                }
            } catch (error) {
                console.error("Erro ao carregar chamados:", error);
            }
        }

        loadChamados();
    }, [user.uid]);

    async function handleDeleteTicket(id) {

        await deleteDoc(doc(listRef, id))
            .then(() => {
                toast.success("Chamado deletado com sucesso!")
                window.location.reload()

            })
            .catch(() => {
                toast.error("Erro ao deletar chamado!")
            })
    }

    if (loading) {
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
        <Content className="chamados-container">
            <Title>Meus Chamados</Title>

            {userChamados.length === 0 ? (
                <div className="chamadosEmpty">
                    <h1>Nenhum chamado encontrado.</h1>
                    <Link to="/novo-chamado" style={{ color: "#fff", float: "right", marginBottom: "15px" }}>
                        <Button color="thirty" variant="contained" startIcon={<FiPlus size={25} />}>
                            Novo Chamado
                        </Button>
                    </Link>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Titulo</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {userChamados.map((item, index) => (
                            <tr key={index} className={item.resposta === "" ? "naoRespondido" : "respondido"}>
                                <td data-label="ID">{item.newID}</td>
                                <td data-label="Titulo">{item.titulo}</td>
                                <td data-label="Descrição">{item.descricao}</td>
                                <td data-label="Status">
                                    <span>
                                        {item.resposta === "" ? "..." : "Respondido"}
                                    </span>
                                </td>
                                <td className="actions" data-label="Ações">
                                    <Tooltip title="Detalhes">
                                        <IconButton color="secondary" size="large" className="action">
                                            <CgDetailsMore size={20} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Excluir" onClick={() => handleDeleteTicket(item.id)}>
                                        <IconButton color="error" size="large" className="action">
                                            <FiTrash size={20} />
                                        </IconButton>
                                    </Tooltip>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </Content>
    )
}
