import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAuth } from './AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'faculty' | 'student'>('student');

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Use the format suggested by the error message
    user.role === 'faculty' ? router.replace('/(faculty)') : router.replace('/');
      } 
    }
  }, [user, loading]);

  const handleLogin = async () => {
    try {
      await login(id, password, role);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.roleSelector}>
        <TouchableOpacity 
          style={[
            styles.roleButton, 
            role === 'student' && styles.activeRole
          ]}
          onPress={() => setRole('student')}
        >
          <Text>Student</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.roleButton, 
            role === 'faculty' && styles.activeRole
          ]}
          onPress={() => setRole('faculty')}
        >
          <Text>Faculty</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  roleButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeRole: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
});