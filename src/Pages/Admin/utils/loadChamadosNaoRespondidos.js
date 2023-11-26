import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../services/connectionFirebase";
import { useState } from "react";

export function useLoadChamados() {

    const [chamadosNaoRespondidos, setChamadosNaoRespondidos] = useState([]);
    const [loadingChamados, setLoadingChamados] = useState(false)

    async function loadChamadosNaoRespondidos(pageTitle) {
        setLoadingChamados(true)

        let pageTitleLower = pageTitle.toLowerCase();

        switch (pageTitleLower) {
            case "em-aberto":
                pageTitleLower = "em aberto";
                break;
            case "em-andamento":
                pageTitleLower = "em andamento";
                break;
            default:
                break;
        }

        
        // Remover hífens e adicionar espaços
        pageTitleLower = pageTitleLower.replace(/-/g, ' ');


        try {
            const q = query(collection(db, "chamados"), where("status", "==", pageTitleLower));
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
                setChamadosNaoRespondidos(chamadoDataWithImages);
                setLoadingChamados(false)

            } else {
                setChamadosNaoRespondidos([]);
                setLoadingChamados(false)
            }
        } catch (error) {
            console.error("Erro ao carregar chamados:", error);
        }
    }
    return { chamadosNaoRespondidos, loadChamadosNaoRespondidos, loadingChamados }
}