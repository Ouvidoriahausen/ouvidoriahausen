import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBLkPYAijjtxHgvfXmOEH3gBZvauXusC4s",
  authDomain: "ouvidoria-grupo-hausen02.firebaseapp.com",
  projectId: "ouvidoria-grupo-hausen02",
  storageBucket: "ouvidoria-grupo-hausen02.appspot.com",
  messagingSenderId: "404602041",
  appId: "1:404602041:web:39ae7616c393c1025eef68"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp)

export { db, auth, storage };