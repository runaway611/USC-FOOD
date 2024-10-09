import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 
import { styles } from './Styles';
import { getUser } from '../services/firebaseService';

export default function RestaurantScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRestaurant, setUserRestaurant] = useState(null);

  // Usa onSnapshot para escuchar los cambios en tiempo real desde Firestore
  useEffect(() => {
    const fetchUserRestaurant = async () => {
      const uid = await getUser();
      setUserRestaurant(uid);
      if (uid) {
        const menuCollectionRef = collection(db, 'restaurants', uid, 'menuItems');

        const unsubscribe = onSnapshot(menuCollectionRef, (snapshot) => {
          const fetchedItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(fetchedItems);
          setLoading(false);
        });

        // Limpia el listener cuando el componente se desmonte
        return () => unsubscribe();
      }
    };

    fetchUserRestaurant(); // Llama a la función para obtener el restaurante
  }, []);

  // Renderizar cada ítem en la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('RestaurantEditItemScreen', { item })} // Navega a la pantalla de edición con el ítem seleccionado
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú del Restaurante</Text>

      {/* Menú de navegación */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RestaurantAddItemScreen')}>
          <Text style={styles.menuText}>Agregar Item</Text>
        </TouchableOpacity>
      </View>

      {/* Menú inferior */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Menú</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Historial</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar lista de ítems */}
      <View style={styles.itemsListContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
      
    </View>
  );
}
