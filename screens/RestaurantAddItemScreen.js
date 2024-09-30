import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importa expo-image-picker correctamente
import { uploadImageToFirebase, addItemToMenu } from '../services/firebaseService';
import { styles } from './Styles';

export default function RestaurantAddItemScreen() {
  const [imageUri, setImageUri] = useState(null); // Estado para almacenar la URI de la imagen seleccionada
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Función para seleccionar una imagen desde la galería usando expo-image-picker
  const pickImage = async () => {
    try {
      // Solicita permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos insuficientes', 'Se requieren permisos para acceder a la galería.');
        return;
      }

      // Abre la galería para seleccionar una imagen
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo permite imágenes
        allowsEditing: true, // Permitir edición básica
        aspect: [4, 3], // Ajustar el aspecto a 4:3
        quality: 1, // Calidad máxima de la imagen
      });

      if (!result.canceled) {
        // Si la selección no fue cancelada, guarda la URI de la imagen
        setImageUri(result.assets[0].uri);
      } else {
        Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  // Función para agregar un ítem al menú junto con la imagen
  const handleAddItem = async () => {
    try {
      if (!imageUri) {
        Alert.alert('Error', 'Selecciona una imagen antes de agregar el ítem.');
        return;
      }

      // Subir la imagen a Firebase Storage y obtener la URL
      const imageUrl = await uploadImageToFirebase(imageUri);

      // Datos del ítem a agregar
      const itemData = {
        name,
        price,
        description,
        imageUrl, // Incluye la URL de la imagen en los datos del ítem
      };

      // Llama a la función para agregar el ítem al menú en Firebase
      await addItemToMenu(itemData);
      Alert.alert('Éxito', 'El ítem ha sido agregado.');
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el ítem.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar ítem al menú</Text>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}

      <TextInput
        style={styles.input}
        placeholder="Nombre del plato"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric" // Para que el teclado sea numérico
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}
