import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { BottomNavigation } from 'react-native-paper';
import OrderStatusScreen from './OrderStatusScreen';
import CartScreen from './CartScreen';

const MainScreen = ({ navigation }) => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const screenWidth = Dimensions.get('window').width;

  const handleViewOrderStatus = () => {
    navigation.navigate('OrderStatus');
  };

  useEffect(() => {
    const allMenuItemsRef = collection(db, 'allMenuItems');

    const unsubscribe = onSnapshot(allMenuItemsRef, (snapshot) => {
      const fetchedDishes = snapshot.docs.map((doc) => ({
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
      const filtered = dishes.filter((dish) =>
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
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.content}>
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
        <Text style={styles.noResults}>No se encontraron resultados.</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleViewOrderStatus}
      >
        <Text style={styles.buttonText}>Ver estado de pedidos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function UserScreen({ navigation }) {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'home', title: 'Inicio', icon: 'home' },
    { key: 'cart', title: 'Carrito', icon: 'cart' },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: () => <MainScreen navigation={navigation} />, // Pasar navigation
    cart: CartScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 20,
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
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 120,
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
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
