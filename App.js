import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen'; 
import RestaurantScreen from './screens/RestaurantScreen';
import UserScreen from './screens/UserScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
