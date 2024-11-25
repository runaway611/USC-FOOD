import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getOrdersByState, getUserRoleAndId } from '../services/firebaseService';

export default function OrderStatusScreen({ route }) {
  const { userId } = route.params || {}; // Obtener el ID del usuario actual
  const [activeTab, setActiveTab] = useState('activos'); // Estado para alternar entre Activos y Completados
  const [orders, setOrders] = useState([]); // Pedidos obtenidos
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchOrders();
  }, [activeTab]);
  
  

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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Pestañas para alternar entre Activos y Completados */}
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

      {/* Lista de pedidos */}
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
  loading: { textAlign: 'center', fontSize: 16, marginVertical: 20 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888' },
});
