import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { CircularProgress } from "@mui/material";
import { Content } from "../../components/layout/Content";
import { useCheckUserType } from "../../utils/useCheckUserType";

export default function DashboardMaster() {

    const { user } = useContext(AuthContext)
    const { checkIsMaster, loadingUserType } = useCheckUserType()

    useEffect(() => {
        checkIsMaster(user.uid, "/admin")
    }, [user.uid]);

    if (loadingUserType) {
        return (
            <div className="loading-full">
                <CircularProgress color="secondary" />
            </div>
        )
    }

    return (
        <Content>
            Master
        </Content>
    )
}
