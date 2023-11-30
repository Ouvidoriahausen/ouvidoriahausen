import { collection, deleteDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify"
import { auth, db, storage } from "../services/connectionFirebase"
import { useNavigate } from "react-router-dom"
import { deleteObject, listAll, ref } from "firebase/storage"

export function useHandleDeleteChamado() {

    const listRef = collection(db, "chamados")
    const navigate = useNavigate()
    const currentUser = auth.currentUser

    async function handleDeleteChamado(id) {

        try {
            // Deletar o chamado no firestore
            const docRef = doc(listRef, id);
            await deleteDoc(docRef);

            // Deletar os arquivos da pasta do chamado
            const folderRef = ref(storage, `chamadoFiles/${currentUser.uid}/${id}`);
            const items = await listAll(folderRef)

            // Deletar cada item encontrado na pasta
            const deletePromises = items.items.map(async (itemRef) => {
                await deleteObject(itemRef)
            })

            // Aguardar até que todos os itens sejam deletados
            await Promise.all(deletePromises);

            toast.success("Chamado deletado com sucesso!");
            navigate("/meus-chamados");
            window.location.reload();
        } catch (error) {
            toast.error("Erro ao deletar chamado!");
            console.error("Erro:", error);
        }
    }

    return { handleDeleteChamado }
}