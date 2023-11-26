import { collection, deleteDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../services/connectionFirebase"

export function useHandleDeleteChamado() {

    const listRef = collection(db, "chamados")

    async function handleDeleteChamado(id) {

        await deleteDoc(doc(listRef, id))
            .then(() => {
                toast.success("Chamado deletado com sucesso!")
                window.location.reload()

            })
            .catch(() => {
                toast.error("Erro ao deletar chamado!")
            })
    }

    return { handleDeleteChamado }
}