import { doc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCheckUserType } from "./utils/checkUserType";
import { CircularProgress } from "@mui/material";
import { SideBarAdmin } from "../../components/layout/sidebar";


export const AdminGlobal = createContext({})


export default function Admin({ children }) {

    const { checkUserType, loadingAdmin } = useCheckUserType()
    const { user } = useContext(AuthContext)
    const [chamadosNaoRespondidos, setChamadosNaoRespondidos] = useState([])
    const [resposta, setResposta] = useState("")
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate()
    const path = useLocation().pathname

    useEffect(() => {
        checkUserType(user.uid)
    }, [user.uid]);

    if (path === "/admin" || path === "/admin/") {
        navigate("/admin/em-aberto")
    }

    if (loadingAdmin) {
        return (
            <div className="loading-full">
                <CircularProgress color="secondary" />
            </div>
        )
    }

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
            <SideBarAdmin />
            {children}
        </AdminGlobal.Provider>
    )
}