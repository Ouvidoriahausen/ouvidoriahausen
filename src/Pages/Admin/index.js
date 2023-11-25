import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminGlobal = createContext({})


export default function Admin({ children }) {

    const { user } = useContext(AuthContext)
    const [chamadosNaoRespondidos, setChamadosNaoRespondidos] = useState([])
    const [resposta, setResposta] = useState("")
    const [isEmpty, setIsEmpty] = useState(false);
    const [userAdmin, setUserAdmin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        navigate("/admin/em-aberto")
    }, [navigate]);

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
                        // Se não for um admin, redirecionar para a página Meus Chamados
                        setUserAdmin(false)
                        console.log("Usuário não é um admin ou não tem um tipo definido.");
                        navigate("/meus-chamados");
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


    const handleRespond = async (chamadoID, resposta) => {
        try {
            const chamadoRef = doc(db, "chamados", chamadoID)
            await updateDoc(chamadoRef, {
                resposta: resposta
            })
            toast.success("Chamado respondido.")
            setResposta("")
        }
        catch (error) {
            toast.error("Erro ao enviar a resposta!")
            console.log("Erro ao enviar a resposta: ", error)
        }
    }

    return (
        <AdminGlobal.Provider
            value={{
                resposta,
                setResposta,
                handleRespond,
                chamadosNaoRespondidos,
                setChamadosNaoRespondidos,
                setIsEmpty,
                isEmpty,
            }}
        >
            {children}
        </AdminGlobal.Provider>
    )
}