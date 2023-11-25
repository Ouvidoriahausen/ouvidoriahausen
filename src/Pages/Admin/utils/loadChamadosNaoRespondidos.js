import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../services/connectionFirebase";
import { useState } from "react";

export function useLoadChamados() {

    const [chamadosNaoRespondidos, setChamadosNaoRespondidos] = useState([]);

    async function loadChamadosNaoRespondidos(statusPage) {
        try {
            const q = query(collection(db, "chamados"), where("status", "==", statusPage));
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
                            console.error('Erro ao obter URL do arquivo:', error);
                            return null;
                        }
                    });

                    const resolvedFileURLs = await Promise.all(fileURLsPromises);

                    return {
                        id: doc.id,
                        titulo: doc.data().titulo,
                        descricao: doc.data().descricao,
                        resposta: doc.data().resposta,
                        status: doc.data().status,
                        fileURLs: resolvedFileURLs.filter((url) => url !== null),
                    };
                });

                const chamadoDataWithImages = await Promise.all(promises);
                setChamadosNaoRespondidos(chamadoDataWithImages);

            } else {
                setChamadosNaoRespondidos([]);
                console.log("Nenhum chamado encontrado com o status:", statusPage);
            }
        } catch (error) {
            console.error("Erro ao carregar chamados:", error);
        }
    }
    return { chamadosNaoRespondidos, loadChamadosNaoRespondidos }
}