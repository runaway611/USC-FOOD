import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, addDoc, query, where, orderBy, onSnapshot   } from 'firebase/firestore'; 
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
    const menuCollectionRef = collection(db, 'restaurants', uid, 'menuItems'); // Colección del restaurante

    // Subir imagen y obtener la URL
    const imageUrl = await uploadImageToFirebase(imageUri);

    // Datos del nuevo ítem
    const newItemData = {
      ...itemData,
      imageUrl,
      restaurantId: uid, // Añadimos el ID del restaurante para referencia
    };

    // Crear un nuevo documento en menuItems y obtener su referencia
    const newDocRef = doc(menuCollectionRef);
    await setDoc(newDocRef, newItemData);

    // Agregar el mismo ítem a la colección global allMenuItems con el mismo ID
    const allMenuItemsDocRef = doc(db, 'allMenuItems', newDocRef.id);
    await setDoc(allMenuItemsDocRef, newItemData);
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

    // Actualizar en la colección del restaurante
    await updateDoc(itemDocRef, {...updatedData,
      imageUrl
    });

    // Reflejar el cambio en la colección `allMenuItems`
    const allMenuItemRef = doc(db, 'allMenuItems', itemId); // Asumiendo que `itemId` es el mismo en ambas colecciones
    const allMenuItemSnapshot = await getDoc(allMenuItemRef);

    if (allMenuItemSnapshot.exists()) {
      await updateDoc(allMenuItemRef, {...updatedData,
        imageUrl
      });
    }
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

    // Eliminar de la colección del restaurante
    await deleteDoc(itemDocRef);

    // Eliminar de la colección `allMenuItems`
    const allMenuItemRef = doc(db, 'allMenuItems', itemId); // Asumiendo que `itemId` es el mismo en ambas colecciones
    const allMenuItemSnapshot = await getDoc(allMenuItemRef);

    if (allMenuItemSnapshot.exists()) {
      await deleteDoc(allMenuItemRef);
    }
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

export const getRestaurantNameByMenuId = async (menuId) => {
  try {
    // Obtener el documento del menú en la colección allMenuItems
    const menuDocRef = doc(db, 'allMenuItems', menuId);
    const menuDocSnap = await getDoc(menuDocRef);

    if (menuDocSnap.exists()) {
      const menuData = menuDocSnap.data();
      const restaurantId = menuData.restaurantId;

      if (restaurantId) {
        // Consultar el restaurante en la colección users
        const restaurantDocRef = doc(db, 'users', restaurantId);
        const restaurantDocSnap = await getDoc(restaurantDocRef);

        if (restaurantDocSnap.exists()) {
          const restaurantData = restaurantDocSnap.data();
          const restaurantName = `${restaurantData.name} ${restaurantData.lastName}`;
          return restaurantName;
        } else {
          console.error('Restaurante no encontrado');
          return 'Restaurante desconocido';
        }
      } else {
        console.error('restaurantId no encontrado en el menú');
        return 'Restaurante desconocido';
      }
    } else {
      console.error('Menú no encontrado');
      return 'Restaurante desconocido';
    }
  } catch (error) {
    console.error('Error al obtener el nombre del restaurante:', error);
    return 'Restaurante desconocido';
  }
};


/**
 * Guarda los pedidos, dividiéndolos por restaurante.
 * @param {string} userId - ID del usuario que realiza el pedido.
 * @param {Array} cartItems - Ítems del carrito.
 */
// Función para guardar el pedido en la base de datos
export const saveOrder = async (userId, cartItems, estimatedTime, observation) => {
  try {
    if (!estimatedTime) {
      throw new Error('El tiempo estimado de entrega es obligatorio.');
    }

    const ordersByRestaurant = cartItems.reduce((acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = [];
      }
      acc[item.restaurantId].push(item);
      return acc;
    }, {});

    const promises = Object.entries(ordersByRestaurant).map(async ([restaurantId, items]) => {
      const orderData = {
        userId,
        restaurantId,
        items,
        estado: 'Pendiente',
        createdAt: new Date().toISOString(),
        estimatedTime, // Incluye el tiempo estimado en cada pedido
        observation: observation || '', // Incluye la observación si existe
      };

      return addDoc(collection(db, 'orders'), orderData);
    });

    await Promise.all(promises);
    console.log('Pedidos guardados correctamente.');
  } catch (error) {
    console.error('Error al guardar los pedidos:', error);
    throw error;
  }
};

// Obtener historial de pedidos del usuario
export const fetchUserOrders = async (userId) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc') // Ordenar por fecha descendente
    );
    const querySnapshot = await getDocs(ordersQuery);

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return orders;
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error);
    throw error;
  }
};

export const listenToUserOrders = (userId, callback) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));

    // Listener para cambios en Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(orders); // Devolvemos los pedidos a través del callback
    });

    return unsubscribe; // Devuelve la función para cancelar la suscripción
  } catch (error) {
    console.error('Error al escuchar los pedidos del usuario:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      estado: newStatus,
    });
    console.log(`Estado del pedido ${orderId} actualizado a ${newStatus}`);
  } catch (error) {
    console.error('Error actualizando el estado del pedido:', error);
    throw error;
  }
};

// Obtener los pedidos del restaurante autenticado
export const fetchRestaurantOrders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const restaurantId = user.uid; // ID del restaurante autenticado

  try {
    const ordersCollection = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersCollection);

    // Filtrar pedidos donde algún ítem coincida con el restaurantId
    const restaurantOrders = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) =>
        order.items.some((item) => item.restaurantId === restaurantId)
      );

    return restaurantOrders;
  } catch (error) {
    console.error('Error obteniendo los pedidos del restaurante:', error);
    throw error;
  }
};

export const getOrdersByState = async (role, id, estado) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where(role === 2 ? 'restaurantId' : 'userId', '==', id), where('estado', '==', estado));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), // Incluye todos los datos del documento, incluidas las observaciones
    }));
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};


export const getUserRoleAndId = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Usuario no autenticado');
  }

  const docRef = doc(db, 'users', currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: currentUser.uid, role: docSnap.data().role };
  } else {
    throw new Error('No se encontró información del usuario');
  }
};

export const getMenusByRestaurant = async (restaurantId) => {
  try {
    const menuItemsRef = collection(db, 'allMenuItems');
    const q = query(menuItemsRef, where('restaurantId', '==', restaurantId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      console.log('No se encontraron menús para este restaurante.');
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los menús:', error);
    throw error;
  }
};














