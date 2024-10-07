import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchItems } from '../services/firebaseService'; // Asegúrate de tener esta función correctamente implementada
import { styles } from './Styles';

export default function RestaurantScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los ítems del menú de Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los ítems:', error);
        setLoading(false);
      }
    };

    fetchData();
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
