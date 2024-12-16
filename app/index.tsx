import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {  Text, Button } from '@/components/ThemedComponents';
import { router } from 'expo-router';
import { COLORS, SIZES, TYPOGRAPHY } from '@/constants';
import { View } from '@/components/Themed';

export default function HomeScreen() {

  const handleNavigateToUpdate = () => {
    router.replace('/update');
  };
  
  const handleNavigateToLogin = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/main.png')}
        style={styles.logo}
      />
      <Text variant="h1" color="primary" style={styles.title}>ERP System</Text>
      <Text variant="h3" color="secondary" style={styles.subtitle}>Welcome to the ERP System</Text>
      <Button 
        title="Login" 
        onPress={handleNavigateToLogin}
        // size="large"
        style={styles.button}
      />
      <Button 
        title="Manage Updates" 
        onPress={handleNavigateToUpdate}
        variant="outlined"
        // size="large"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
    // backgroundColor: COLORS.background.default,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.large,
  },
  title: {
    marginBottom: SIZES.small,
  },
  subtitle: {
    marginBottom: SIZES.xlarge,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: SIZES.medium,
  },
});

