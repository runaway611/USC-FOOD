import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { fetchUserOrders, getUser, getRestaurantNameByMenuId } from '../services/firebaseService';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await getUser();
        const userOrders = await fetchUserOrders(userId);

        // Agregar el nombre del restaurante a cada pedido
        const ordersWithRestaurantNames = await Promise.all(
          userOrders.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                const restaurantName = await getRestaurantNameByMenuId(item.id);
                return { ...item, restaurantName };
              })
            );
            return { ...order, items: updatedItems };
          })
        );

        setOrders(ordersWithRestaurantNames);
      } catch (error) {
        console.error('Error al cargar el historial de pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderDate}>
        Pedido realizado el: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <FlatList
        data={item.items}
        keyExtractor={(product) => product.id}
        renderItem={({ item: product }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
        )}
      />
      <Text style={styles.orderTotal}>
        Total: ${item.items.reduce((sum, product) => sum + Number(product.price || 0), 0)}
      </Text>
      <Text style={styles.restaurantName}>
        Restaurante: {item.items[0]?.restaurantName || 'Desconocido'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tienes pedidos registrados aún.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  restaurantName: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
