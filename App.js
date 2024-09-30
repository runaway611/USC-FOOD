import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RestaurantScreen from './screens/RestaurantScreen';
import RestaurantAddItemScreen from './screens/RestaurantAddItemScreen';
import RestaurantEditItemScreen from './screens/RestaurantEditItemScreen';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Pantalla de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Ocultar el encabezado en el login
        />

        {/* Pantalla del Usuario */}
        <Stack.Screen 
          name="User" 
          component={UserScreen} 
          options={{ title: 'Usuario' }} 
        />

        {/* Pantalla Principal del Restaurante */}
        <Stack.Screen 
          name="Restaurant" 
          component={RestaurantScreen} 
          options={{ title: 'Restaurante' }} 
        />

        {/* Pantalla para agregar un nuevo ítem */}
        <Stack.Screen 
          name="RestaurantAddItemScreen" 
          component={RestaurantAddItemScreen} 
          options={{ title: 'Agregar Item' }} 
        />

        {/* Pantalla para editar y eliminar un ítem */}
        <Stack.Screen 
          name="RestaurantEditItemScreen" 
          component={RestaurantEditItemScreen} 
          options={{ title: 'Editar/Eliminar Item' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
