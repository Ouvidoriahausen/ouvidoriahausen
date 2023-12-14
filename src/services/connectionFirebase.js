import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

//Banco de dados #01 (Production)
// const firebaseConfig = {
//   apiKey: "AIzaSyCoawov7wWinuqQ1fMBBp7Klucg0HAX8OU",
//   authDomain: "ouvidoria-grupo-hausen.firebaseapp.com",
//   projectId: "ouvidoria-grupo-hausen",
//   storageBucket: "ouvidoria-grupo-hausen.appspot.com",
//   messagingSenderId: "890407503584",
//   appId: "1:890407503584:web:928648e499c6aca9caf285"
// };

//Banco de dados #02 (Development)
const firebaseConfig = {
  apiKey: "AIzaSyBLkPYAijjtxHgvfXmOEH3gBZvauXusC4s",
  authDomain: "ouvidoria-grupo-hausen02.firebaseapp.com",
  projectId: "ouvidoria-grupo-hausen02",
  storageBucket: "ouvidoria-grupo-hausen02.appspot.com",
  messagingSenderId: "404602041",
  appId: "1:404602041:web:39ae7616c393c1025eef68"
};

// Banco de dados #03 (Development)
// const firebaseConfig = {
//   apiKey: "AIzaSyAwSr_Vk8vdj5tUmr0cf5bLqiLhCRXCyFU",
//   authDomain: "ouvidoriabanco03.firebaseapp.com",
//   projectId: "ouvidoriabanco03",
//   storageBucket: "ouvidoriabanco03.appspot.com",
//   messagingSenderId: "708491457330",
//   appId: "1:708491457330:web:14be75e1be5c0e55cedd2b"
// };


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp)

export { db, auth, storage };