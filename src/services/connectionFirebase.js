import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCoawov7wWinuqQ1fMBBp7Klucg0HAX8OU",
  authDomain: "ouvidoria-grupo-hausen.firebaseapp.com",
  projectId: "ouvidoria-grupo-hausen",
  storageBucket: "ouvidoria-grupo-hausen.appspot.com",
  messagingSenderId: "890407503584",
  appId: "1:890407503584:web:928648e499c6aca9caf285"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };