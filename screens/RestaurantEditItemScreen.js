import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function RestaurantEditItemScreen({ route }) {
  const { item } = route.params; // Recibes el ítem seleccionado

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [imageUri, setImageUri] = useState(item.imageUrl);

  const handleSave = () => {
    // Aquí puedes implementar la lógica para guardar los cambios
    console.log('Guardando los cambios del ítem...');
  };

  return (
    <View>
      <Text>Editar ítem</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre del ítem"
      />
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Precio del ítem"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción del ítem"
      />

      <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />

      <TouchableOpacity onPress={handleSave}>
        <Text>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}
