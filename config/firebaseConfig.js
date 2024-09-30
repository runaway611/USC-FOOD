import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBprDeSYge5isNEtb-gIwkiVkiPB_fazy4",
  authDomain: "usc-food-db.firebaseapp.com",
  projectId: "usc-food-db",
  storageBucket: "usc-food-db.appspot.com",
  messagingSenderId: "676199616132",
  appId: "1:676199616132:web:3d6a85800cd7803504bcd1"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


const db = getFirestore(app);

export { db, auth, storage };