import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { Backdrop, CircularProgress } from "@mui/material";
import { useUserType } from "../hooks/useUserType";

export default function MasterPrivate({ children }) {

    const { signed, loading } = useContext(AuthContext)
    const userType = useUserType()

    if (loading) {
        return (
            <Backdrop open>
                <CircularProgress color="secondary" />
            </Backdrop>
        )
    }

    if (userType !== "master" && !signed) {
        return <Navigate to="/" />
    }

    return children;
}