import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MeusTickets.css"

export default function MeusTickets() {

    const { user } = useContext(AuthContext);
    const [userTickets, setUserTickets] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        async function loadTickets() {
            const q = query(collection(db, "Tickets"), where("userID", "==", user.uid));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    let tickets = [];
                    querySnapshot.forEach((doc) => {
                        tickets.push({
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            resposta: doc.data().resposta,
                            // Adicione aqui os campos de arquivo, se aplicável
                        });
                    });
                    setUserTickets(tickets);
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.error("Erro ao carregar tickets:", error);
            }
        }

        loadTickets();
    }, [user.uid]);

    return (
        <div>
            <h2>Meus Tickets</h2>
            {userTickets.map((ticket) => (
                <div key={ticket.id}>
                    <h3>{ticket.titulo}</h3>
                    <p>{ticket.descricao}</p>
                    {ticket.resposta && <p>Resposta: {ticket.resposta}</p>}
                </div>
            ))}
            {isEmpty && <p>Nenhum ticket encontrado.</p>}

            <Link to="/ticket" className="newTicket">
                Criar Novo Ticket
            </Link>
        </div>
    )
}
