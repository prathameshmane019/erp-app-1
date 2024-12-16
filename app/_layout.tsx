// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { SplashScreen, Stack } from 'expo-router';
// import { useEffect } from 'react';
// import { useColorScheme } from 'react-native';
// import { UpdateProvider } from './UpdateContext';
// import { AuthProvider } from './AuthContext';

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'index',
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <AuthProvider>
//       <UpdateProvider>
//         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//           <Stack>
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen name="update" options={{ title: 'Manage Updates' }} />
//           </Stack>
//         </ThemeProvider>
//       </UpdateProvider>
//     </AuthProvider>
//   );
// }
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthProvider } from './AuthContext';
import { UpdateProvider } from './UpdateContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'splash',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [appError, setAppError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setAppError(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (appError) {
    return <ErrorScreen error={appError} onRetry={() => setAppError(null)} />;
  }

  return <RootLayoutNav />;
}

function ErrorScreen({ 
  error, 
  onRetry 
}: { 
  error: Error, 
  onRetry: () => void 
}) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <UpdateProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: 'Login' }} />
            <Stack.Screen name="update" options={{ title: 'Manage Updates' }} />
            <Stack.Screen name="faculty/profile" options={{ headerShown: false }} />
            <Stack.Screen name="faculty/index" options={{ title: 'ERP System' }}/>
            <Stack.Screen name="faculty/attendance/index" options={{ title: 'Attendance Module' }}  />
            <Stack.Screen name="faculty/attendance/takeattendance" options={{ title: 'New Attendance' }} />
            <Stack.Screen name="faculty/attendance/updateattendance" options={{ title: 'Update Attendance' }} />
          </Stack>
        </ThemeProvider>
      </UpdateProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8d7da',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#721c24',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});