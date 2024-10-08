import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import { getAuth, initializeAuth, getReactNativePersistence, browserSessionPersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
  auth.setPersistence(browserSessionPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const db = getFirestore(app);

export { db, auth, storage };
