import React, { useContext, useMemo } from 'react';
import { StyleSheet, StatusBar, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, TouchableOpacity } from '@/components/ThemedComponents';
import { useAuth } from '../AuthContext';
import { COLORS, SIZES, TYPOGRAPHY, BORDERRADIUS } from '@/constants';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.2;

export default function ModuleSelectionScreen() {
  const router = useRouter();
  const { user, logout } = useAuth()

  const modules = useMemo(() => [
    {
      name: 'Attendance',
      description: 'Track and manage attendance records',
      icon: 'calendar',
      gradient: ['#4facfe', '#00f2fe'],
      route: user?.role === 'faculty' ? '/(faculty)/attendance' : '/student/attendance'
    },
    {
      name: 'Feedback',
      description: 'Submit and review feedback',
      icon: 'message-square',
      gradient: ['#00e97b', '#3ff9d7'],
      route: user?.role === 'faculty' ? '/faculty/feedback' : '/student/feedback'
    },
    {
      name: user?.role === 'faculty' ? 'Course Management' : 'My Courses',
      description: 'Manage your academic courses',
      icon: 'book-open',
      gradient: ['#fa709a', '#ffaa00'],
      route: user?.role === 'faculty' ? '/faculty/courses' : '/student/courses'
    }
  ], [user?.role]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text variant="h3" color="secondary">Welcome back,</Text>
            <Text variant="h1" color="primary" style={styles.userName}>{user?.name || 'User'}</Text>
            <View style={styles.instituteWrapper}>
              <Text variant="h4" color="primary">{user?.institute?.name || 'Institution'}</Text>
              <View style={styles.instituteLine} />
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Feather name="user" size={24} color={COLORS.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/update-info')}>
              <Feather name="refresh-cw" size={24} color={COLORS.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Feather name="log-out" size={24} color={COLORS.status.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.moduleGrid}>
          {modules.map((module, index) => (
            <TouchableOpacity
              key={module.name}
              style={styles.moduleCard}
              onPress={() => router.push(module.route)}
            >
              <LinearGradient
                colors={module.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.moduleContent}
              >
                <View style={styles.moduleTextContent}>
                  <Text style={styles.moduleName}>{module.name}</Text>
                  <Text style={styles.moduleDescription}>{module.description}</Text>
                </View>
                <View style={styles.moduleIconContainer}>
                  <Feather name={module.icon} size={40} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.large,
  },
  userName: {
    marginVertical: SIZES.small,
  },
  instituteWrapper: {
    alignSelf: 'flex-start',
  },
  instituteLine: {
    height: 2,
    backgroundColor: COLORS.primary.main,
    marginTop: SIZES.small,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: SIZES.medium,
  },
  moduleGrid: {
    gap: SIZES.medium,
  },
  moduleCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BORDERRADIUS.large,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.large,
  },
  moduleTextContent: {
    flex: 1,
  },
  moduleName: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginBottom: SIZES.small,
  },
  moduleDescription: {
    fontSize: TYPOGRAPHY.fontSize.body2,
    color: COLORS.neutral.white,
  },
  moduleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

