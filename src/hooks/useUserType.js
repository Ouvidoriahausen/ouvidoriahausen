import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from '../services/connectionFirebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export const UserTypeContext = createContext();

export const useUserType = () => {
    return useContext(UserTypeContext);
  };

export const UserTypeProvider = ({ children }) => {

    const [userType, setUserType] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(collection(db, "users"), user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();

                        if (userData && userData.type) {
                            setUserType(userData.type);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao obter dados do usuário:", error);
                }
            } else {
                setUserType("");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserTypeContext.Provider value={userType}>
            {children}
        </UserTypeContext.Provider>
    );
};
