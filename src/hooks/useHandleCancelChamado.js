import { collection, doc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../services/connectionFirebase"
import { useNavigate } from "react-router-dom"

export function useHandleCancelChamado() {

    const chamadosCollectionRef = collection(db, "chamados")
    const navigate = useNavigate()

    async function handleCancelChamado(id) {

        try {
            const chamadoDocRef = doc(chamadosCollectionRef, id);

            // Atualizar o status do chamado para "morto"
            await updateDoc(chamadoDocRef, {
                status: "morto"
            });

            toast.success("Chamado deletado com sucesso!");
            navigate("/chamados");
            window.location.reload();
        } catch (error) {
            toast.error("Erro ao deletar chamado!");
            console.error("Erro:", error);
        }
    }

    return { handleCancelChamado }
}