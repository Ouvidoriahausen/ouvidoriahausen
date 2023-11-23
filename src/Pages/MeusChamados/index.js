import "./meusChamados.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Content } from "../../components/layout/Content";

export default function MeusChamados() {

    const { user } = useContext(AuthContext);
    const [userChamados, setUserChamados] = useState([]);
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
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            resposta: doc.data().resposta,
                        });
                    });
                    setUserChamados(chamados);
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.error("Erro ao carregar chamados:", error);
            }
        }

        loadChamados();
    }, [user.uid]);

    return (
        <Content>
            <h2>Meus Chamados</h2>
            {userChamados.map((chamado) => (
                <div key={chamado.id}>
                    <h3>{chamado.titulo}</h3>
                    <p>{chamado.descricao}</p>
                    {chamado.resposta && <p>Resposta: {chamado.resposta}</p>}
                </div>
            ))}
            {isEmpty && <p>Nenhum ticket encontrado.</p>}
        </Content>
    )
}
