import { useContext, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { AuthContext, LOCAL_STORAGE_KEY } from "../contexts/AuthContext"
import { Backdrop, CircularProgress } from "@mui/material";
import { useCheckUserType } from "../utils/useCheckUserType";

export default function Private({ children }) {

    const { signed, loading, user } = useContext(AuthContext)
    const { isAdmin, checkUserType } = useCheckUserType()
    const UserLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY)
    const userStorage = JSON.parse(UserLocalStorage)
    const path = useLocation().pathname
    const navigate = useNavigate()


    useEffect(() => {
        checkUserType(userStorage.uid, "/");
    }, [isAdmin, navigate, path, user, checkUserType, signed]);


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