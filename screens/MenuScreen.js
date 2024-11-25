import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { getMenusByRestaurant, getUser } from '../services/firebaseService';
import { useNavigation } from '@react-navigation/native';

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const user = await getUser();
        if (user) {
          const fetchedMenuItems = await getMenusByRestaurant(user);
          setMenuItems(fetchedMenuItems);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RestaurantEditItemScreen', { item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  
  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Carousel
          data={menuItems}
          renderItem={renderCarouselItem}
          width={300}
          height={200}
          loop
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: { width: 150, height: 100, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#777', marginBottom: 5, textAlign: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});
