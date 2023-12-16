import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useContext, useState, useEffect } from "react";
import { db, storage } from "../services/connectionFirebase";
import { AuthContext } from "../contexts/AuthContext";

export function useLoadChamadosCancelados() {

    const { user } = useContext(AuthContext)
    const [chamadosCancelados, setChamadosCancelados] = useState([]);
    const [loadingChamados, setLoadingChamados] = useState(false)

    useEffect(() => {
        // Carregar chamados cancelados apenas quando o usuário estiver disponível
        if (user) {
            loadChamadosCancelados();
        }
    }, [user]);

    async function loadChamadosCancelados() {
        setLoadingChamados(true)

        try {
            const q = query(collection(db, "chamados"), where("status", "==", "morto"), where("userID", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const promises = querySnapshot.docs.map(async (doc) => {
                    const fileURLs = doc.data().fileURLs || [];
                    const fileRefs = fileURLs.map((url) => ref(storage, url));
                    const fileURLsPromises = fileRefs.map(async (fileRef) => {
                        try {
                            const url = await getDownloadURL(fileRef);
                            return url;
                        } catch (error) {
                            return null;
                        }
                    });

                    const resolvedFileURLs = await Promise.all(fileURLsPromises);

                    return {
                        id: doc.id,
                        newID: doc.data().newID,
                        titulo: doc.data().titulo,
                        descricao: doc.data().descricao,
                        resposta: doc.data().resposta,
                        status: doc.data().status,
                        fileURLs: resolvedFileURLs.filter((url) => url !== null),
                    };
                });

                const chamadoDataWithImages = await Promise.all(promises);
                setChamadosCancelados(chamadoDataWithImages);
                setLoadingChamados(false)

            } else {
                setChamadosCancelados([]);
                setLoadingChamados(false)
            }
        } catch (error) {
            //
        }
    }
    return { chamadosCancelados, loadChamadosCancelados, loadingChamados }
}