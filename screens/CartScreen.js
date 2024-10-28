import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useCart } from './CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();

  return (
    <View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
            <Button title="Eliminar" onPress={() => removeFromCart(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default CartScreen;
