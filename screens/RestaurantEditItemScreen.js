import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { updateMenuItem, deleteMenuItem, uploadImageToFirebase } from '../services/firebaseService';
import { styles } from './Styles';

export default function RestaurantEditItemScreen({ route, navigation }) {
  const { item } = route.params; // Recibe el ítem seleccionado

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [imageUri, setImageUri] = useState(item.imageUrl); // Iniciar con la URL de la imagen del item

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos insuficientes', 'Se requieren permisos para acceder a la galería.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  const handleUpdate = async () => {
    try {
      let newImageUrl = imageUri;

      // Si la imagen fue cambiada, se sube la nueva imagen
      if (imageUri !== item.imageUrl) {
        newImageUrl = await uploadImageToFirebase(imageUri);
      }

      // Actualiza los datos del ítem
      const updatedItem = {
        name,
        price,
        description,
        imageUrl: newImageUrl,
      };

      await updateMenuItem(item.id, updatedItem); // Actualizar en Firestore
      Alert.alert('Éxito', 'El ítem ha sido actualizado.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el ítem.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenuItem(item.id); // Eliminar el ítem en Firestore
      Alert.alert('Éxito', 'El ítem ha sido eliminado.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el ítem.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar ítem</Text>

      <TouchableOpacity onPress={pickImage}>
        <Text>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}

      <TextInput
        style={styles.input}
        placeholder="Nombre del ítem"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio del ítem"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del ítem"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar ítem</Text>
      </TouchableOpacity>
    </View>
  );
}
