import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../services/connectionFirebase";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";

export function useLoadChamados() {

    const { user } = useContext(AuthContext);
    const chamadosCollection = "chamados"

    // Muitos Chamados
    const [userChamados, setUserChamados] = useState([]);
    const [loadingChamados, setLoadingChamados] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    // Um chamado
    const [isEmptyById, setIsEmptyById] = useState(false);
    const [newID, setNewID] = useState("")
    const [titulo, setTitulo] = useState("")
    const [descricao, setDescricao] = useState("")
    const [resposta, setResposta] = useState("")
    const [status, setStatus] = useState("em aberto")
    const [moreDetails, setMoreDetails] = useState("")
    const [respostaDetails, setRespostaDetails] = useState("")
    const [files, setFiles] = useState([])
    const [filesMoreDetails, setFilesMoreDetails] = useState([])


    // Muitos Chamados

    async function loadChamados() {
        const q = query(collection(db, chamadosCollection), orderBy("newID", "desc"), where("userID", "==", user.uid));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                let chamados = [];
                querySnapshot.forEach((doc) => {
                    const chamadoData = {
                        id: doc.id,
                        newID: doc.data().newID,
                        fileURLs: doc.data().fileURLs,
                        titulo: doc.data().titulo,
                        descricao: doc.data().descricao,
                        resposta: doc.data().resposta,
                        status: doc.data().status,
                        moreDetails: doc.data().moreDetails,
                        filesMoreDetails: doc.data().filesMoreDetails,
                        respostaDetails: doc.data().respostaDetails,
                        created: doc.data().created,
                    };

                    // Adiciona à lista somente se o status não for "morto"
                    if (chamadoData.status !== "morto") {
                        chamados.push(chamadoData);
                    }
                });

                setUserChamados(chamados)
                setIsEmpty(chamados.length === 0)

            } else {
                setIsEmpty(true)
            }

            setLoadingChamados(false)

        } catch (error) {
            console.error("Erro ao carregar chamados:", error);
        }
    }


    // Apenas um chamado

    async function loadChamadoById(id) {
        setLoadingChamados(true)

        const docRef = doc(db, chamadosCollection, id);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setNewID(data.newID);
                setTitulo(data.titulo);
                setDescricao(data.descricao);
                setResposta(data.resposta);
                setStatus(data.status);
                setFiles(data.fileURLs)
                setMoreDetails(data.moreDetails)
                setRespostaDetails(data.respostaDetails)
                setFilesMoreDetails(data.filesMoreDetails)
                

                setIsEmptyById(false)
                setLoadingChamados(false)
            } else {
                setIsEmptyById(true)
                setLoadingChamados(false)
            }
        } catch (error) {
            console.error("Erro ao carregar chamado:", error);
        }
    }

    return {
        // Muitos Chamados
        loadChamados,
        setUserChamados,
        userChamados,
        loadingChamados,
        setLoadingChamados,
        setIsEmpty,
        isEmpty,

        // Um chamado
        loadChamadoById,
        titulo,
        newID,
        descricao,
        status,
        moreDetails,
        resposta,
        respostaDetails,
        files,
        filesMoreDetails,
        isEmptyById,

        setStatus,
        setResposta,
        setMoreDetails,
        setRespostaDetails,
        setFilesMoreDetails,
    }
}