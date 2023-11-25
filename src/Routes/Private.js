import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { CircularProgress } from "@mui/material";


export default function Private({ children }) {

    const { signed, loading } = useContext(AuthContext)

    if (loading) {
        return (
            <div className="loading-full">
                <CircularProgress color="secondary" />
            </div>
        )
    }

    if (!signed) {
        return <Navigate to="/" />
    }

    return children
}