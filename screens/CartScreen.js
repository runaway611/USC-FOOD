import React, { useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native';
import { CartContext } from '../context/CartContext';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  // Calcula el total verificando que cada item tenga un precio válido
  const total = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0; // Asegúrate de que el precio es un número
    return sum + price;
  }, 0);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Button title="Eliminar" onPress={() => removeFromCart(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>El carrito está vacío</Text>}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <Button title="Vaciar Carrito" onPress={clearCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});
