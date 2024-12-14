// UpdateContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as Updates from 'expo-updates';

interface UpdateDetails {
  version: string;
  description: string;
  size: string;
  releaseDate: string;
}

interface UpdateInfo {
  isUpdateAvailable: boolean;
  lastChecked: string | null;
  currentVersion: string | null;
  updateDetails: UpdateDetails | null;
  error: string | null;
  isLoading: boolean;
  updateProgress: number;
}

interface UpdateContextType {
  updateInfo: UpdateInfo;
  checkForUpdates: () => Promise<void>;
  performUpdate: () => Promise<void>;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isUpdateAvailable: false,
    lastChecked: null,
    currentVersion: Updates.manifest?.version ?? null,
    updateDetails: null,
    error: null,
    isLoading: false,
    updateProgress: 0
  });

  const checkForUpdates = async (): Promise<void> => {
    setUpdateInfo(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        const manifest = await Updates.manifest;
        const updateDetails: UpdateDetails = {
          version: manifest?.version ?? 'Unknown',
          description: manifest?.extra?.description ?? 'No description available',
          size: manifest?.extra?.size ?? 'Unknown',
          releaseDate: new Date().toISOString()
        };

        setUpdateInfo(prev => ({
          ...prev,
          isUpdateAvailable: true,
          lastChecked: new Date().toISOString(),
          updateDetails,
          isLoading: false
        }));
      } else {
        setUpdateInfo(prev => ({
          ...prev,
          isUpdateAvailable: false,
          lastChecked: new Date().toISOString(),
          isLoading: false
        }));
      }
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Check for updates failed',
        isLoading: false
      }));
    }
  };

  const performUpdate = async (): Promise<void> => {
    setUpdateInfo(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      updateProgress: 0 
    }));

    try {
      // Download update
      const update = await Updates.fetchUpdateAsync(
        (progress: { totalBytesWritten: number; totalBytesExpected: number; }) => {
          setUpdateInfo(prev => ({
            ...prev,
            updateProgress: Math.round((progress.totalBytesWritten / progress.totalBytesExpected) * 100)
          }));
        }
      );

      if (!update) {
        throw new Error('Update download failed');
      }

      // Apply update
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Update failed',
        isLoading: false,
        updateProgress: 0
      }));
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <UpdateContext.Provider value={{
      updateInfo,
      checkForUpdates,
      performUpdate
    }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdateContext = (): UpdateContextType => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdateContext must be used within an UpdateProvider');
  }
  return context;
};
