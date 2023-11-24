import "./meusChamados.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { Content } from "../../components/layout/Content";
import { Title } from "../../components/layout/Title";

export default function MeusChamados() {

    const { user } = useContext(AuthContext);
    const [userChamados, setUserChamados] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    // Estilos para chamados respondidos ou não
    const answered = {
        border: "1px solid #00FF2A"
    }
    const notAnswered = {
        border: "1px solid red"
    }

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
    <Content className="chamados-container">
            <Title>Meus Chamados</Title>
            {userChamados.map((chamado) => (
                <>
                    <div style={chamado.resposta ? answered : notAnswered} className="card-chamado" key={chamado.id}>
                        <h2>{chamado.titulo}</h2>
                        <p>Descrição: <strong>{chamado.descricao}</strong></p>
                    </div>

                    <div style={chamado.resposta ? answered : notAnswered} className="card-resposta">
                        {chamado.resposta ?
                            <p>Resposta: <strong>{chamado.resposta}</strong></p>
                            :
                            <p>Nenhuma resposta encontrada.</p>
                        }
                    </div>
                </>
            ))}
            {isEmpty && <p>Nenhum ticket encontrado.</p>}
        </Content>
    )
}
