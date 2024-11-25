import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestaurantOrdersScreen from './RestaurantOrdersScreen';
import RestaurantAddItemScreen from './RestaurantAddItemScreen';
import MenuScreen from './MenuScreen';

const Tab = createBottomTabNavigator();

export default function RestaurantScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Menú" component={MenuScreen} />
      <Tab.Screen name="Pedidos" component={RestaurantOrdersScreen} />
      <Tab.Screen name="Agregar Item" component={RestaurantAddItemScreen} />
    </Tab.Navigator>
  );
}
