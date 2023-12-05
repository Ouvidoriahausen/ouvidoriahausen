import { useEffect, useState } from "react";
import { Content } from "../../components/layout/Content";
import { useUserType } from "../../hooks/useUserType";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

export default function DashboardMaster() {

    const userType = useUserType()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // Verificação de usuário
    useEffect(() => {

        if(userType === "master"){
            setLoading(false)
            return
        }

        if (userType === "admin") {
            navigate("/admin")
        } else if (userType === "comum") {
            navigate("/meus-chamados")
        }
    }, [userType, loading]);

    if (loading) {
        return (
            <Content>
                <Backdrop open>
                    <CircularProgress sx={{ color: "#fff" }} />
                </Backdrop>
            </Content>
        )
    }

    return (
        <Content>
            Master
        </Content>
    )
}
