import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity } from '@/components/ThemedComponents';
import { useAuth } from '@/app/AuthContext';
import { COLORS, SIZES, TYPOGRAPHY, BORDERRADIUS } from '@/constants';
import { Feather } from '@expo/vector-icons';

interface MenuButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  gradient: string[];
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, subtitle, onPress, gradient }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.menuButtonGradient}
    >
      <View style={styles.menuButtonContent}>
        <View style={styles.menuButtonLeft}>
          <View style={styles.iconContainer}>
            <Feather name={icon} color="white" size={24} />
          </View>
          <View style={styles.menuButtonText}>
            <Text style={styles.menuButtonTitle}>{title}</Text>
            <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Feather name="chevron-right" color="white" size={20} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function FacultyMenuScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const [faculty, setFaculty] = useState(user);

 

  return (
    <LinearGradient
      colors={[COLORS.background.paper, COLORS.background.default]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.profileHeaderGradient}
          >
            <View style={styles.profileAvatar}>
              <Feather name="user" color="white" size={40} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{faculty?.name}</Text>
              <Text style={styles.designation}>Faculty, {faculty?.department}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.detailsCard}>
          <DetailItem icon="mail" label="Email Address" value={faculty?.email || ""} />
          <DetailItem icon="book-open" label="Current Year" value={faculty?.currentYear || ""} />
          <DetailItem 
            icon="briefcase" 
            label="Subjects" 
            value={faculty?.subjects?.map(subject => subject.name).join(', ') || 'No Subjects'} 
          />
        </View>

        <View style={styles.menuGrid}>
          <MenuButton 
            icon="calendar"
            title="Take Attendance"
            subtitle="Mark today's attendance"
            gradient={['#4facfe', '#00f2fe']}
            onPress={() => router.push('/faculty/attendance/takeattendance')}
          />
          <MenuButton 
            icon="clock"
            title="Update Attendance"
            subtitle="Modify previous records"
            gradient={['#43e97b', '#38f9d7']}
            onPress={() => router.push('/faculty/attendance/updateattendance')}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

interface DetailItemProps {
  icon: string;
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailIconContainer}>
      <Feather name={icon} color={COLORS.primary.main} size={20} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.medium,
  },
  profileHeader: {
    marginBottom: SIZES.large,
    borderRadius: BORDERRADIUS.large,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeaderGradient: {
    padding: SIZES.large,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  profileInfo: {
    marginLeft: SIZES.small,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginBottom: SIZES.small,
  },
  designation: {
    fontSize: TYPOGRAPHY.fontSize.body1,
    color: COLORS.neutral.white,
  },
  detailsCard: {
    backgroundColor: COLORS.background.paper,
    borderRadius: BORDERRADIUS.large,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    elevation: 4,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small / 2,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.body1,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  menuGrid: {
    gap: SIZES.medium,
  },
  menuButton: {
    borderRadius: BORDERRADIUS.large,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  menuButtonGradient: {
    padding: SIZES.medium,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  menuButtonText: {
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginBottom: SIZES.small / 2,
  },
  menuButtonSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.body2,
    color: COLORS.neutral.white,
  },
});

