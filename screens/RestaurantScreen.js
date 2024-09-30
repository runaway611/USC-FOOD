import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Styles';

export default function RestaurantScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú del Restaurante</Text>

      {/* Menú de navegación */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('RestaurantAddItemScreen')}>
          <Text style={styles.menuText}>Agregar Item</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('RestaurantEditItemScreen')}>
          <Text style={styles.menuText}>Editar Item</Text>
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
    </View>
  );
}
