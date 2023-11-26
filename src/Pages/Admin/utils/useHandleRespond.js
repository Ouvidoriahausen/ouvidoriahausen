import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/connectionFirebase";
import { toast } from "react-toastify";

export default function useHandleRespond() {
    async function handleRespond(chamadoID, resposta, setResposta) {
        try {
            const chamadoRef = doc(db, "chamados", chamadoID)
            await updateDoc(chamadoRef, {
                resposta: resposta,
            })
            toast.success("Chamado respondido.")
            setResposta("")
        }
        catch (error) {
            toast.error("Erro ao enviar a resposta!")
        }
    }

    return { handleRespond }
}
