import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Backdrop, CircularProgress } from "@mui/material";
import { useUserType } from "../hooks/useUserType";

export function Private({ children, allowedUserType }) {
    const { signed, loading } = useContext(AuthContext);
    const userType = useUserType();
    const [isReloading, setIsReloading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Verifica se a página está sendo recarregada
        setIsReloading(true);
        setTimeout(() => {
            setIsReloading(false);
        }, 500);// (não altere esse valor) // Defina um tempo para o estado mudar após o carregamento inicial, para evitar redirecionamentos indesejados
    }, [location.pathname]);

    if (loading || isReloading) {
        return (
            <Backdrop open>
                <CircularProgress color="secondary" />
            </Backdrop>
        );
    }

    if (!allowedUserType.includes(userType) || !signed) {
        return <Navigate to="/" />;
    }

    return children;
}

// Comum Private
export function ComumPrivate({ children }) {
    return <Private allowedUserType={["comum"]}>{children}</Private>;
}

// Admin Private
export function AdminPrivate({ children }) {
    return <Private allowedUserType={["admin", "master"]}>{children}</Private>;
}

// Master Private
export function MasterPrivate({ children }) {
    return <Private allowedUserType={["master"]}>{children}</Private>;
}
