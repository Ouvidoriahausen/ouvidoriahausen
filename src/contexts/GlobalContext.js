import AuthProvider from "./AuthContext";

export default function GlobalProvider({ children }){
    return(
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}