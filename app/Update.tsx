import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useUpdateContext } from './UpdateContext';
import Colors from '@/constants/Colors';

export default function UpdateScreen() {
  const { updateInfo, checkForUpdates, performUpdate } = useUpdateContext();

  const formatDate = (dateString: string | null): string => {
    return dateString ? new Date(dateString).toLocaleString() : 'Never';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>App Update Manager</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Version</Text>
            <Text style={styles.infoValue}>
              {updateInfo.currentVersion || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Checked</Text>
            <Text style={styles.infoValue}>
              {formatDate(updateInfo.lastChecked)}
            </Text>
          </View>

          {updateInfo.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
              {updateInfo.updateProgress > 0 && (
                <Text style={styles.progressText}>
                  Downloading: {updateInfo.updateProgress}%
                </Text>
              )}
            </View>
          )}

          {updateInfo.isUpdateAvailable && updateInfo.updateDetails && !updateInfo.isLoading && (
            <View style={styles.updateNotice}>
              <Text style={styles.updateTitle}>Update Available</Text>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>New Version:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.version}
                </Text>
              </View>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.description}
                </Text>
              </View>
              
              <View style={styles.updateDetail}>
                <Text style={styles.detailLabel}>Size:</Text>
                <Text style={styles.detailValue}>
                  {updateInfo.updateDetails.size}
                </Text>
              </View>
            </View>
          )}

          {updateInfo.error && (
            <Text style={styles.errorText}>
              {updateInfo.error}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={checkForUpdates}
            disabled={updateInfo.isLoading}
            style={[
              styles.button, 
              styles.checkButton,
              updateInfo.isLoading && styles.disabledButton
            ]}
          >
            <Text style={styles.buttonText}>Check Updates</Text>
          </TouchableOpacity>

          {updateInfo.isUpdateAvailable && !updateInfo.isLoading && (
            <TouchableOpacity 
              onPress={performUpdate}
              style={[styles.button, styles.updateButton]}
            >
              <Text style={styles.buttonText}>Update Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  updateNotice: {
    backgroundColor: 'rgba(3, 218, 198, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  updateDetail: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButton: {
    backgroundColor: Colors.light.tint,
    marginRight: 8,
  },
  updateButton: {
    backgroundColor: '#03DAC6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  }
});
