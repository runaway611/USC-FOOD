import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToFirebase, updateMenuItem, deleteMenuItem } from '../services/firebaseService';
import { styles } from './Styles';

export default function RestaurantEditItemScreen({ route, navigation }) {
  const { item } = route.params; // El ítem pasado como parámetro de navegación
  const [itemName, setItemName] = useState(item.name);
  const [itemPrice, setItemPrice] = useState(item.price);
  const [itemDescription, setItemDescription] = useState(item.description);
  const [imageUri, setImageUri] = useState(item.imageUrl);
  const [uploading, setUploading] = useState(false);

  const handleUpdateItem = async () => {
    if (!itemName || !itemPrice || !itemDescription || !imageUri) {
      Alert.alert('Error', 'Por favor llena todos los campos e incluye una imagen');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = imageUri;
      // Si se seleccionó una nueva imagen, subirla a Firebase Storage
      if (imageUri !== item.imageUrl) {
        imageUrl = await uploadImageToFirebase(imageUri);
      }

      // Actualizar ítem en Firestore
      await updateMenuItem(item.id, {
        name: itemName,
        price: itemPrice,
        description: itemDescription,
        imageUrl: imageUrl,
      });

      Alert.alert('Éxito', 'Ítem actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar el ítem');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteMenuItem(item.id);
      Alert.alert('Éxito', 'Ítem eliminado correctamente');
      navigation.goBack(); // Regresar a la pantalla anterior después de eliminar
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al eliminar el ítem');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar ítem del menú</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre del plato"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={itemPrice}
        onChangeText={setItemPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={itemDescription}
        onChangeText={setItemDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateItem} disabled={uploading}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteItem} disabled={uploading}>
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}
