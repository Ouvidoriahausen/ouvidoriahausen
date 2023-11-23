import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage"
import { useContext, useEffect, useState } from "react"
import { db, storage } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { SideBar } from "../../components/layout/sidebar";
import { Content } from "../../components/layout/Content";


export default function Admin() {

    const { user } = useContext(AuthContext)
    const [ChamadoNaoRespondidos, setChamadoNaoRespondidos] = useState([])
    const [isEmpty, setIsEmpty] = useState(false);
    const [userAdmin, setUserAdmin] = useState(false)
    const navigate = useNavigate()

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

    useEffect(() => {
        async function loadChamadosNaoRespondidos() {
            try {
                const q = query(collection(db, "chamados"), where("resposta", "==", ""));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {

                    const promises = querySnapshot.docs.map(async (doc) => {

                        // Filtro e promises do array de arquivos(fileURLs)
                        const fileURLs = doc.data().fileURLs || []
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

                        const resolvedFileURLs = await Promise.all(fileURLsPromises)

                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            resposta: doc.data().resposta,
                            fileURLs: resolvedFileURLs.filter((url) => url !== null),
                        };

                    });


                    const chamadoDataWithImages = await Promise.all(promises);
                    setChamadoNaoRespondidos(chamadoDataWithImages);
                    setIsEmpty(false)

                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.error("Erro ao carregar chamados:", error);
            }
        }

        loadChamadosNaoRespondidos();
    }, []);


    const handleRespond = async (chamadoID, resposta) => {
        try {
            await updateDoc(doc(db, "chamados", chamadoID, { resposta }))
            setChamadoNaoRespondidos((prevChamados) =>
                prevChamados.filter((chamado) => chamado.id != chamadoID)
            )
        } catch (error) {
            console.error("Erro ao responder chamado: ", error)
        }
    }

    return (
        <>
            <SideBar />
            <Content>
                {userAdmin && <h2>Chamados Não Respondidos</h2>}
                {ChamadoNaoRespondidos.map((chamado) => (
                    <div key={chamado.id}>
                        <h3>{chamado.titulo}</h3>
                        <p>{chamado.descricao}</p>
                        <input
                            type="text"
                            placeholder="Resposta"
                            onChange={(e) => handleRespond(chamado.id, e.target.value)}
                        />
                        {chamado.fileURLs && chamado.fileURLs.map((image, index) => (
                            <div key={index}>
                                <img src={image} width={100} alt='Chamado Image' />
                            </div>
                        ))}
                    </div>
                ))}
                {isEmpty && <p>Nenhum chamado encontrado.</p>}
                <Link to="/novo-chamado">Testar chamados</Link>
            </Content>
        </>
    )
}