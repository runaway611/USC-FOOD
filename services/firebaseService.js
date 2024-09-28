import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore'; 
import { db } from '../config/firebaseConfig'; 

// Registrar usuario en Firebase Authentication y Firestore
export const registerUser = async (email, password, userName, userLastName, userPhone) => {
  const auth = getAuth();
  try {
    // Registrar el usuario en Firebase Authentication
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
      role: 'user',  // Asignar el rol de usuario normal
      verified: false  // Usuario aún no verificado
    });

    return { success: true, message: 'Registro exitoso. Verifica tu correo electrónico.' };
  } catch (error) {
    console.error('Error al registrar el usuario: ', error);
    return { success: false, message: 'Hubo un problema al registrar el usuario.' };
  }
};
