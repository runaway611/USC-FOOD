import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const screenWidth = Dimensions.get('window').width;

export default function UserHomeScreen() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allMenuItemsRef = collection(db, 'allMenuItems');
    const unsubscribe = onSnapshot(allMenuItemsRef, (snapshot) => {
      const fetchedDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDishes(fetchedDishes);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Carousel
          width={screenWidth}
          height={300}
          autoPlay={true}
          data={dishes}
          scrollAnimationDuration={1000}
          renderItem={renderItem}
          mode="parallax-layers"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
});
