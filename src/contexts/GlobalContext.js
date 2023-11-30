import { UserTypeProvider } from "../hooks/useUserType";
import AuthProvider from "./AuthContext";

export default function GlobalProvider({ children }) {
    return (
        <AuthProvider>
            <UserTypeProvider>
                {children}
            </UserTypeProvider>
        </AuthProvider>
    )
}