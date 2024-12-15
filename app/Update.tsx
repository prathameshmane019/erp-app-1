import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useUpdateContext } from './UpdateContext';
import Colors from '@/constants/Colors';

const UpdateScreen: React.FC = () => {
  const { updateInfo, checkForUpdates, performUpdate } = useUpdateContext();

  const formatDate = (dateString: string | null): string => {
    return dateString ? new Date(dateString).toLocaleString() : 'Never';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>App Update Manager</Text>

        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Version</Text>
              <Text style={styles.value}>
                {updateInfo.currentVersion || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Version</Text>
              <Text style={[styles.value, styles.versionText]}>
                {updateInfo.currentVersion || 'N/A'}
              </Text>
            </View>
          </View>

          {updateInfo.isLoading && (
            <View style={styles.loadingSection}>
              <ActivityIndicator
                size="large"
                color={Colors.light.tint}
              />
              {updateInfo.updateProgress > 0 && (
                <Text style={styles.progressText}>
                  Downloading: {updateInfo.updateProgress}%
                </Text>
              )}
            </View>
          )}

          {updateInfo.isUpdateAvailable && updateInfo.updateDetails && !updateInfo.isLoading && (
            <View style={styles.updateSection}>
              <Text style={styles.updateTitle}>Update Available</Text>

              <View style={styles.updateDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>New Version</Text>
                  <Text style={styles.detailValue}>
                    {updateInfo.updateDetails.version}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>New Version</Text>
                  <Text style={[styles.detailValue, styles.versionText]}>
                    {updateInfo.updateDetails?.version}
                  </Text>
                </View>

                <View style={[styles.detailRow, styles.descriptionRow]}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.description}>
                    {updateInfo.updateDetails.description || 'No description available'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {updateInfo.error && (
            <View style={styles.errorSection}>
              <Text style={styles.errorText}>{updateInfo.error}</Text>
            </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 8, // Add padding to prevent text from touching the label
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  versionText: {
    fontFamily: 'monospace', // Use monospace for version numbers
    letterSpacing: 0.5,      // Add slight spacing between characters
  },
  loadingSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  progressText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.tint,
  },
  updateSection: {
    backgroundColor: 'rgba(3, 218, 198, 0.08)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  updateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#03DAC6',
    marginBottom: 16,
  },
  updateDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descriptionRow: {
    flexDirection: 'column',
    gap: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    minWidth: 100,
  },

  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  errorSection: {
    backgroundColor: 'rgba(176, 0, 32, 0.08)',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    backgroundColor: Colors.light.tint,
  },
  updateButton: {
    backgroundColor: '#03DAC6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default UpdateScreen;