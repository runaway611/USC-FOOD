import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getOrdersByState, updateOrderStatus, getUserRoleAndId } from '../services/firebaseService';

export default function RestaurantOrdersScreen({ route }) {
  const { restaurantId } = route.params || {}; // Obtener el ID del restaurante
  const [activeTab, setActiveTab] = useState('activos'); // Alternar entre Activos y Completados
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Definir fetchOrders como una función independiente
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { id, role } = await getUserRoleAndId(); // Obtener ID y rol
      const estado = activeTab === 'activos' ? 'Pendiente' : 'Listo'; // Estado basado en la pestaña activa
      const fetchedOrders = await getOrdersByState(role, id, estado); // Consultar pedidos según estado
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Actualizar lista después de cambiar el estado
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.orderId}>Pedido ID: {item.id}</Text>
      <Text>Estado: {item.estado}</Text>
      <Text>Hora estimada de entrega: {item.estimatedTime || 'No especificada'}</Text>
      {item.items.map((menuItem, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemName}>{menuItem.name}</Text>
          <Text>{menuItem.description}</Text>
        </View>
      ))}
      {activeTab === 'activos' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.inProcessButton}
            onPress={() => handleUpdateStatus(item.id, 'En proceso')}
          >
            <Text style={styles.buttonText}>En proceso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.completedButton}
            onPress={() => handleUpdateStatus(item.id, 'Listo')}
          >
            <Text style={styles.buttonText}>Listo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activos' && styles.activeTab]}
          onPress={() => setActiveTab('activos')}
        >
          <Text style={[styles.tabText, activeTab === 'activos' && styles.activeTabText]}>Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completados' && styles.activeTab]}
          onPress={() => setActiveTab('completados')}
        >
          <Text style={[styles.tabText, activeTab === 'completados' && styles.activeTabText]}>
            Completados
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loading}>Cargando...</Text>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No hay pedidos en esta categoría.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#ddd' },
  activeTab: { borderBottomColor: '#007bff' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#007bff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 3 },
  orderId: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemContainer: { marginTop: 5 },
  itemName: { fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  inProcessButton: { backgroundColor: '#FFC107', padding: 10, borderRadius: 5 },
  completedButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  loading: { textAlign: 'center', fontSize: 16, marginVertical: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888' },
});
