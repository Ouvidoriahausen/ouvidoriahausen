import { doc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"
import { db } from "../../services/connectionFirebase";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCheckUserType } from "./utils/checkUserType";
import { CircularProgress } from "@mui/material";
import { SideBarAdmin } from "../../components/layout/sidebar";


export const AdminGlobal = createContext({
    chamadosNaoRespondidos: [],
    setChamadosNaoRespondidos: () => { },
    setIsEmpty: () => { },
    isEmpty: false,
});


export default function Admin({ children }) {

    const { checkUserType, loadingAdmin } = useCheckUserType()
    const { user } = useContext(AuthContext)
    const [chamadosNaoRespondidos, setChamadosNaoRespondidos] = useState([])
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate()
    const path = useLocation().pathname

    useEffect(() => {
        checkUserType(user.uid)
    }, [user.uid]);

    if (path === "/admin" || path === "/admin/") {
        navigate("/admin/em-aberto")
    }

    if (loadingAdmin) {
        return (
            <div className="loading-full">
                <CircularProgress color="secondary" />
            </div>
        )
    }

    return (
        <AdminGlobal.Provider
            value={{
                chamadosNaoRespondidos,
                setChamadosNaoRespondidos,
                setIsEmpty,
                isEmpty,
            }}
        >
            <SideBarAdmin />
            {children}
        </AdminGlobal.Provider>
    )
}