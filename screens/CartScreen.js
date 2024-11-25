import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import { saveOrder, getUser, getRestaurantNameByMenuId } from '../services/firebaseService';

export default function CartScreen() {
  const navigation = useNavigation();
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(new Date());
  const [observation, setObservation] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleConfirmPurchase = async () => {
    const uid = await getUser(); // Obtener el ID del usuario actual
    if (!uid) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }
  
    if (cart.length === 0) {
      Alert.alert('Error', 'El carrito está vacío.');
      return;
    }
  
    if (!estimatedTime) {
      Alert.alert('Error', 'Por favor, selecciona una hora estimada de entrega.');
      return;
    }
  
    try {
      // Guardar el pedido dividido por restaurantes con el tiempo estimado y observaciones
      await saveOrder(uid, cart, estimatedTime.toISOString(), observation); 
      Alert.alert('Compra Confirmada', 'Tu pedido ha sido guardado exitosamente.');
      clearCart(); // Vaciar el carrito después de guardar
      setModalVisible(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el pedido. Por favor, inténtalo de nuevo.');
    }
  };
  
  

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Card.Divider />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Precio: ${item.price}</Text>
      <Text style={styles.quantity}>Cantidad: 1</Text>
      <Button
        title="Eliminar"
        onPress={() => removeFromCart(item.id)}
        buttonStyle={styles.deleteButton}
        icon={<Icon name="delete" color="#fff" />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>El carrito está vacío</Text>}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <Button
        title="Confirmar Compra"
        onPress={() => setModalVisible(true)}
        buttonStyle={styles.confirmButton}
        icon={<Icon name="check" color="#fff" />}
      />

      {/* Botón para ir al historial de pedidos */}
      <Button
        title="Ver Historial de Pedidos"
        onPress={() => navigation.navigate('OrderHistory')} // Navega a la pantalla del historial
        buttonStyle={styles.historyButton}
        icon={<Icon name="history" color="#fff" />}
        containerStyle={{ marginTop: 10 }}
      />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Compra</Text>
            <Text style={styles.label}>Hora estimada de entrega:</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timePicker}>
              <DateTimePicker
                value={estimatedTime || new Date()}
                mode="time"
                is24Hour={true}
                display="inline"
                onChange={(event, selectedTime) => {
                  setShowPicker(false);
                  if (selectedTime) {
                    setEstimatedTime(selectedTime);
                  }
                }}
                style={{ backgroundColor: 'black' }}
              />
            </TouchableOpacity>
            <Text style={styles.label}>Observaciones (opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe aquí cualquier observación"
              value={observation}
              onChangeText={setObservation}
              multiline
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPurchase}>
                <Text style={styles.buttonText}>✅ Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  historyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
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
    marginVertical: 10,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  timePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButtonModal: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  cancelButtonModal: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
