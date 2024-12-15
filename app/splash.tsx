
import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import {  Text } from '@/components/ThemedComponents';
import { router } from 'expo-router';
import { COLORS, SIZES, TYPOGRAPHY } from '@/constants';
import { useAuth } from './AuthContext';
import { View } from '@/components/Themed';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        user.role === 'faculty' ? router.replace('/(faculty)') : router.replace('/');
        
      } else {
        router.replace('/');
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/main.png')}
        style={styles.logo}
      />
      <Text variant="h1" color="primary" style={styles.title}>ERP System</Text>
      <Text variant="body1" color="secondary">Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.default,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: SIZES.large,
  },
  title: {
    marginBottom: SIZES.medium,
  },
});