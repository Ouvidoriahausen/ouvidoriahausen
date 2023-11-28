import { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext, LOCAL_STORAGE_KEY } from "../contexts/AuthContext"
import { Backdrop, CircularProgress } from "@mui/material";
import { useCheckUserType } from "../utils/useCheckUserType";

export default function Private({ children }) {

    const { signed, loading } = useContext(AuthContext)
    const { checkUserType } = useCheckUserType()
    const UserLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const userStorage = JSON.parse(UserLocalStorage)


    useEffect(() => {
        checkUserType(userStorage.uid);
    }, [userStorage, checkUserType]);


    if (loading) {
        return (
            <Backdrop open>
                <CircularProgress color="secondary" />
            </Backdrop>
        )
    }

    if (!signed) {
        return <Navigate to="/" />
    }

    return children
}