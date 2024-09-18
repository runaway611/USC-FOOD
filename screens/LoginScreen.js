import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './Styles';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore'; 
import { db } from '../config/firebaseConfig'; 
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  const auth = getAuth();
  const navigation = useNavigation();

  const handleRegister = async () => {
    const email = userEmail.toLowerCase(); // Convierte el correo a minúsculas
    const password = userPassword;

    // Verificar si el correo tiene el dominio @outlook.com
    if (!email.endsWith('@outlook.com')) {
      Alert.alert('Error', 'Solo se permiten correos de @outlook.com');
      return;
    }

    try {
      // Registrar el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enviar un correo de verificación
      await sendEmailVerification(user);

      // Guardar el usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: userName,
        lastName: userLastName,
        phone: userPhone,
        role: 'user',  // Asignar el rol de usuario normal
        verified: false  // Usuario aún no verificado
      });

      Alert.alert('Registro exitoso', 'Por favor verifica tu correo electrónico.');
      navigation.navigate('User');  // Redirigir a la pantalla de usuario

    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
    }
  };

  const handleTabChange = (tab) => {
    setIsLogin(tab === 'login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>USC</Text>
        <Text style={styles.logoSubtitle}>Universidad Santiago de Cali</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isLogin && styles.activeTab]}
          onPress={() => handleTabChange('login')}
        >
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isLogin && styles.activeTab]}
          onPress={() => handleTabChange('register')}
        >
          <Text style={styles.tabText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

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
