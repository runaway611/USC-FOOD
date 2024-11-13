import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TextInput, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function UserScreen() {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  useEffect(() => {
    const allMenuItemsRef = collection(db, 'allMenuItems');

    const unsubscribe = onSnapshot(allMenuItemsRef, (snapshot) => {
      const fetchedDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDishes(fetchedDishes);
      setFilteredDishes(fetchedDishes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredDishes(dishes);
    } else {
      const filtered = dishes.filter(dish =>
        dish.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDishes(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar platos..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredDishes.length > 0 ? (
        <Carousel
          data={filteredDishes}
          renderItem={renderItem}
          width={screenWidth}
          height={250}
          mode="parallax-layers"
        />
      ) : (
        <Text>No se encontraron resultados.</Text>
      )}
       <Button title="Ir al Carrito" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    minHeight: 200, // Ajusta la altura mínima para asegurar espacio
    flexDirection: 'column', // Apilar elementos en columna
  },
  image: {
    width: '100%',
    height: 120, // Reduce la altura para dejar espacio para el texto
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
