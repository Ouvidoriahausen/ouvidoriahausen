import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { useContext, useEffect, useState } from "react"
import { db, storage } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Admin() {

    const { user } = useContext(AuthContext)
    const [TickNaoRespondidos, setTickNaoRespondidos] = useState([])
    const [isEmpty, setIsEmpty] = useState(false);
    const [userAdmin, setUserAdmin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function checkUserType() {
            const userDocRef = doc(db, "users", user.uid);
            try {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userType = userDocSnap.data().type;
                    if (userType === "admin") {
                        // Se type for "admin"
                        setUserAdmin(true)
                    } else {
                        // Se não for um admin, redirecionar para a página MeusTickets
                        setUserAdmin(false)
                        console.log("Usuário não é um admin ou não tem um tipo definido.");
                        navigate("/MeusTickets");
                    }
                } else {
                    console.log("Documento do usuário não encontrado no Firestore.");
                }
            } catch (error) {
                console.error("Erro ao verificar o tipo do usuário:", error);
            }
        }

        checkUserType();
    }, [user.uid]);

    useEffect(() => {
        async function loadTicketsNaoRespondidos() {
            const q = query(collection(db, "Tickets"), where("resposta", "==", ""));
            try {
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {

                    const promises = querySnapshot.docs.map(async (doc) => {
                        const fileRef = ref(storage, doc.data().fileURL);
                        const fileURL = await getDownloadURL(fileRef);
                        console.log(fileURL)

                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            resposta: doc.data().resposta,
                            fileURL: fileURL,
                        };

                    });

                    
                    const ticketDataWithImages = await Promise.all(promises);
                    setTickNaoRespondidos(ticketDataWithImages);
                    setIsEmpty(false)

                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.error("Erro ao carregar tickets:", error);
            }
        }

        loadTicketsNaoRespondidos();
    }, []);


    const handleRespond = async (ticketID, resposta) => {
        try {
            await updateDoc(doc(db, "Tickets", ticketID, { resposta }))
            setTickNaoRespondidos((prevTickets) =>
                prevTickets.filter((ticket) => ticket.id != ticketID)
            )
        } catch (error) {
            console.error("Erro ao responder ticket: ", error)
        }
    }

    return (
        <div>
            {userAdmin && <h2>Tickets Não Respondidos</h2>}
            {TickNaoRespondidos.map((ticket) => (
                <div key={ticket.id}>
                    <h3>{ticket.titulo}</h3>
                    <p>{ticket.descricao}</p>
                    <input
                        type="text"
                        placeholder="Resposta"
                        onChange={(e) => handleRespond(ticket.id, e.target.value)}
                    />
                    <img src={ticket.fileURL} width={100} alt='Ticket Image' />
                </div>
            ))}
            {isEmpty && <p>Nenhum ticket encontrado.</p>}
        </div>
    )
}