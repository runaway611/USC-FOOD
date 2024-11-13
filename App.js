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
            options={{ title: 'Agregar Item' }}
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

        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
