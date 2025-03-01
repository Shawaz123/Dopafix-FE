import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Authentication Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_GOOGLE_CLIENT_ID', 
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuth(response.authentication.accessToken);
    }
  }, [response]);

  // Google Login - Send Google Token to Backend
  const handleGoogleAuth = async (accessToken) => {
    try {
      const res = await axios.get(`http://localhost:4300/auth/google/callback?access_token=${accessToken}`);
      if (res.data.token) {
        Alert.alert("Login Successful", "Welcome back!");
        navigation.replace('HomeScreen'); 
      }
    } catch (error) {
      Alert.alert("Google Login Failed", "Please try again.");
      console.error('Google login error:', error);
    }
  };

  // Email & Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4300/auth/login', { email, password });
      if (response.data.token) {
        Alert.alert("Login Successful", "Welcome back!");
        navigation.replace('HomeScreen'); 
      }
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password.");
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' }} style={styles.headerImage} />
        <Text style={styles.title}>Welcome to Wellness</Text>
        <Text style={styles.subtitle}>Your journey to better health starts here</Text>
      </View>

      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ffffff80"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ffffff80"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Email & Password Login Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login with Email</Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D38AE',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff90',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  getStartedButton: {
    backgroundColor: '#1EB023',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  googleButton: {
    backgroundColor: '#1EB023',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
