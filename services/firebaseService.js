import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebaseConfig'; 

// Registrar usuario en Firebase Authentication y Firestore
export const registerUser = async (email, password, userName, userLastName, userPhone) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Enviar un correo de verificación
    await sendEmailVerification(user);

    // Guardar el usuario en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: userName,
      lastName: userLastName,
      phone: userPhone,
      role: 1,  // Asignar rol 1 a usuarios normales
      verified: false  // Usuario aún no verificado
    });

    return { success: true, message: 'Registro exitoso. Verifica tu correo electrónico.' };
  } catch (error) {
    console.error('Error al registrar el usuario: ', error);
    return { success: false, message: 'Hubo un problema al registrar el usuario.' };
  }
};

// Función para el login de usuarios y obtener su rol
export const loginUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener el documento del usuario en Firestore para ver su rol
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return { success: true, role: userData.role };
    } else {
      return { success: false, message: 'No se encontró información de usuario.' };
    }
  } catch (error) {
    console.error('Error al iniciar sesión: ', error);
    return { success: false, message: 'Correo o contraseña incorrectos.' };
  }
};

// Subir imagen a Firebase Storage y obtener la URL
const uploadImageToFirebase = async (uri) => {
  if (!uri) {
    throw new Error("URI de imagen no válida");
  }

  try {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageName = `menuItems/${Date.now()}_${uri.split('/').pop()}`;
    const storageRef = ref(storage, imageName);

    // Sube la imagen a Firebase Storage
    await uploadBytes(storageRef, blob);

    // Obtén la URL de descarga de la imagen subida
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw new Error("Error al subir la imagen");
  }
};


// Agregar ítem al menú
export const addItemToMenu = async (itemData, imageUri) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid; // UID del restaurante autenticado
    const menuCollectionRef = collection(db, `restaurants/${uid}/menuItems`);

    // Primero sube la imagen y obtén la URL
    const imageUrl = await uploadImageToFirebase(imageUri);

    if (imageUrl) {
      // Luego guarda el ítem con la URL de la imagen en Firestore
      try {
        await setDoc(doc(menuCollectionRef), {
          ...itemData,
          imageUrl, // Aquí se agrega la URL de la imagen
        });
        console.log("Item added successfully");
      } catch (error) {
        console.error('Error al agregar ítem al menú:', error);
        throw new Error('Error al agregar ítem al menú');
      }
    } else {
      console.error('Error: No se pudo obtener la URL de la imagen');
      throw new Error('No se pudo obtener la URL de la imagen');
    }
  } else {
    throw new Error('Usuario no autenticado');
  }
};

// Actualizar ítem en el menú
export const updateMenuItem = async (itemId, updatedData, imageUri) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const imageUrl = await uploadImageToFirebase(imageUri);

  if (user) {
    const uid = user.uid;
    const itemDocRef = doc(db, `restaurants/${uid}/menuItems`, itemId);
    await updateDoc(itemDocRef, {...updatedData,
      imageUrl
    }) ;
  } else {
    throw new Error('Usuario no autenticado');
  }
};

// Eliminar ítem del menú
export const deleteMenuItem = async (itemId) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    const itemDocRef = doc(db, `restaurants/${uid}/menuItems`, itemId);
    await deleteDoc(itemDocRef);
  } else {
    throw new Error('Usuario no autenticado');
  }
};

export const fetchItems = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  const itemsCollection = collection(db, 'restaurants', uid, 'menuItems');
  const itemsSnapshot = await getDocs(itemsCollection);
  const itemsList = itemsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return itemsList;
};

export const getUser = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  return uid;
}

