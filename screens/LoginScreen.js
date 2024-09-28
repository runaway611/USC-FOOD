import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './Styles';
import { registerUser } from '../services/firebaseService'; // Importa la función

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    const email = userEmail.toLowerCase(); // Convierte el correo a minúsculas
    const password = userPassword;

    // Verificar si el correo tiene el dominio @outlook.com
    if (!email.endsWith('@outlook.com')) {
      Alert.alert('Error', 'Solo se permiten correos de @outlook.com');
      return;
    }

    // Llamar a la función de servicio para registrar el usuario
    const result = await registerUser(email, password, userName, userLastName, userPhone);
    
    if (result.success) {
      Alert.alert('Registro exitoso', result.message);
      navigation.navigate('User');  // Redirigir a la pantalla de usuario
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Resto del código UI */}
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
          <TouchableOpacity style={styles.button}>
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
    </View>
  );
}
