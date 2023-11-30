import { useEffect } from "react";
import { Content } from "../../components/layout/Content";
import { useUserType } from "../../hooks/useUserType";
import { useNavigate } from "react-router-dom";

export default function DashboardMaster() {

    const userType = useUserType()
    const navigate = useNavigate()

    // Verificação de usuário
    useEffect(() => {
        if (userType !== "master") {
            navigate("/admin")
        }
    }, [userType]);

    return (
        <Content>
            Master
        </Content>
    )
}
