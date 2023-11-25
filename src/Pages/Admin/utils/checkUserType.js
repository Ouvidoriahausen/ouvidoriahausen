import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../services/connectionFirebase";
import { useNavigate } from "react-router-dom";

export function useCheckUserType() {

    const [isAdmin, setIsAdmin] = useState(false)
    const [loadingAdmin, setLoadingAdmin] = useState(false)
    const navigate = useNavigate()

    async function checkUserType(userID) {
        setLoadingAdmin(true)
        const userDocRef = doc(db, "users", userID);
        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userType = userDocSnap.data().type;
                if (userType === "admin") {
                    // Se type for "admin"
                    setIsAdmin(true)
                    setLoadingAdmin(false)
                } else {
                    // Se não for um admin, redirecionar para a página Meus Chamados
                    setIsAdmin(false)
                    setLoadingAdmin(true)
                    console.log("Usuário não é um admin ou não tem um tipo definido.");
                    navigate("meus-chamados");
                }
            } else {
                console.log("Documento do usuário não encontrado no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao verificar o tipo do usuário:", error);
        }
    }
    return { checkUserType, setIsAdmin, isAdmin, loadingAdmin, setLoadingAdmin}
}
