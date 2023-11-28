import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/connectionFirebase";

export function useCheckUserType() {

    const [isAdmin, setIsAdmin] = useState(false)
    const [isMaster, setIsMaster] = useState(false)
    const [loadingUserType, setLoadingUserType] = useState(false)
    const navigate = useNavigate()

    async function checkUserType(userID, rota) {

        setLoadingUserType(true)

        const userDocRef = doc(db, "users", userID);
        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userType = userDocSnap.data().type;
                if (userType === "admin" || userType === "master") {
                    // Se type for "admin" ou "master"
                    setIsAdmin(true)
                    setLoadingUserType(false)
                } else {
                    // Se não for um admin, redirecionar para a página Meus Chamados
                    setIsAdmin(false)
                    setLoadingUserType(true)
                    { rota && navigate(rota); }
                }
            } else {
                console.log("Documento do usuário não encontrado no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao verificar o tipo do usuário:", error);
        }
    }

    async function checkIsMaster(userID) {
        setLoadingUserType(true)
        
        const userDocRef = doc(db, "users", userID);

        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userType = userDocSnap.data().type;
                if (userType === "master") {
                    setIsMaster(true);
                    setLoadingUserType(false)
                } else {
                    setIsMaster(false);
                    setLoadingUserType(false)
                    navigate("/admin");
                }
            } else {
                console.log("Documento do usuário não encontrado no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao verificar o tipo do usuário:", error);
        }
    }
    return {
        checkUserType,
        checkIsMaster,
        isAdmin,
        isMaster,
        setIsAdmin,
        setIsMaster,
        loadingUserType,
        setLoadingUserType,
    }
}
