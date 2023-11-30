import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../services/connectionFirebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});
export const LOCAL_STORAGE_KEY = "@hausen"

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem(LOCAL_STORAGE_KEY)

      if (storageUser) {
        setUser(JSON.parse(storageUser))
        setLoading(true)
      }
      setLoading(false)
    }
    loadUser()

  }, []);

  async function FazerLogin(email, password) {
    setLoadingAuth(true)

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid

        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)

        let data = {
          uid: uid,
          nome: docSnap.data().nome,
          email: value.user.email,
          type: docSnap.data().type,
        }

        setUser(data)
        storageUser(data)
        setLoadingAuth(false)

        toast.success("Bem vindo(a) de volta :D")
        navigate("/meus-chamados")

      })
      .catch(() => {
        toast.error("Erro ao fazer login, confira todos os dados!!")
        setLoadingAuth(false)
      })
  }

  async function Cadastrar(email, password, userName) {
    setLoadingAuth(true)

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid

        await setDoc(doc(db, "users", uid), {
          userID: uid,
          nome: userName,
          email: email,
          type: "comum",
        })
          .then(() => {
            let data = {
              uid: uid,
              nome: userName,
              email: email,
              type: "comum",
            }

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)

            navigate("/meus-chamados")
            toast.success("Seja bem vindo ao sistema :D")
          })
      })
      .catch((error) => {
        const errorCode = error.code

        switch (errorCode) {
          case "auth/email-already-in-use":
            toast.error("O E-mail já está sendo ultilizado!")
            break
          case "auth/weak-password":
            toast.error("A senha deve obter no mínimo 6 caracteres!")
            break
          default:
            toast.error("Erro ao fazer o login.")
            break
        }
        setLoadingAuth(false)
      })
  }

  function storageUser(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

  async function logout() {
    await signOut(auth)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    navigate("/")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        FazerLogin,
        Cadastrar,
        loading,
        loadingAuth,
        storageUser,
        setUser,
        logout,
      }}>

      {children}
    </AuthContext.Provider>
  )
}