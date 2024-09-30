import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './Styles';
import { registerUser, loginUser } from '../services/firebaseService'; // Importa la función de servicio
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const navigation = useNavigation();

  // Función para manejar el login
  const handleLogin = async () => {
    const result = await loginUser(userEmail, userPassword);

    if (result.success) {
      const userRole = result.role;

      // Redirigir a la pantalla según el rol del usuario
      if (userRole === 1) {
        navigation.navigate('User');  // Redirigir a la pantalla de usuario normal
      } else if (userRole === 2) {
        navigation.navigate('Restaurant');  // Redirigir a la pantalla de restaurante
      } else {
        Alert.alert('Error', 'Rol de usuario desconocido');
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleRegister = async () => {
    const email = userEmail.toLowerCase(); // Convierte el correo a minúsculas
    const password = userPassword;

    // Verificar si el correo tiene el dominio @outlook.com
    if (!email.endsWith('@outlook.com')) {
      Alert.alert('Error', 'Solo se permiten correos de @outlook.com');
      return;
    }

    const result = await registerUser(email, password, userName, userLastName, userPhone);
    
    if (result.success) {
      Alert.alert('Registro exitoso', result.message);
      navigation.navigate('User');  // Redirigir a la pantalla de usuario
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20} // Ajustar espacio extra al hacer scroll
      keyboardShouldPersistTaps="handled" // Permite que el teclado siga abierto al hacer scroll
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>USC</Text>
        <Text style={styles.logoSubtitle}>Universidad Santiago de Cali</Text>
      </View>

      {/* Contenedor de pestañas para alternar entre Login y Registrarse */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isLogin && styles.activeTab]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isLogin && styles.activeTab]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={styles.tabText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar formulario de login o registro según la pestaña activa */}
      {isLogin ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={userPassword}
            onChangeText={setUserPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={userLastName}
            onChangeText={setUserLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Celular"
            value={userPhone}
            onChangeText={setUserPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={userPassword}
            onChangeText={setUserPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
