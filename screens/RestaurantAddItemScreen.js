import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importa expo-image-picker
import { uploadImageToFirebase, addItemToMenu } from '../services/firebaseService';
import { styles } from './Styles';


export default function RestaurantAddItemScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  

  // Nueva función pickImage actualizada
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
  

  const handleAddItem = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Por favor, selecciona una imagen válida antes de continuar.');
      return;
    }
  
    try {
      const itemData = {
        name,
        price,
        description,
      };
  
      // Llama a la función para agregar el ítem junto con la URI de la imagen
      await addItemToMenu(itemData, imageUri);
      Alert.alert('Éxito', 'El ítem ha sido agregado.');
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el ítem.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar ítem al menú</Text>

      <TouchableOpacity onPress={pickImage}>
        <Text>Seleccionar Imagen</Text>
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
