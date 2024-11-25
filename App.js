import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RestaurantScreen from './screens/RestaurantScreen';
import RestaurantAddItemScreen from './screens/RestaurantAddItemScreen';
import RestaurantEditItemScreen from './screens/RestaurantEditItemScreen';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderStatusScreen from './screens/OrderStatusScreen';
import RestaurantOrdersScreen from './screens/RestaurantOrdersScreen';
import MenuScreen from './screens/MenuScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={{ title: 'Usuario' }}
          />
          <Stack.Screen
            name="Restaurant"
            component={RestaurantScreen}
            options={{ title: 'Restaurante' }}
          />
          <Stack.Screen
            name="RestaurantAddItemScreen"
            component={RestaurantAddItemScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RestaurantEditItemScreen"
            component={RestaurantEditItemScreen}
            options={{ title: 'Editar/Eliminar Item' }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: 'Detalles del Producto' }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: 'Carrito de Compras' }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ title: 'Historial de Pedidos' }}
          />
          <Stack.Screen
            name="OrderStatus"
            component={OrderStatusScreen}
            options={{ title: 'Estado de Pedido' }}
          />

          <Stack.Screen
            name="RestaurantOrders"
            component={RestaurantOrdersScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }}
          />


        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
