// UpdateContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as Updates from 'expo-updates';

interface UpdateDetails {
  version: string;
  description?: string;
  size?: string;
  releaseDate?: string;
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

// Helper function to format version ID
const formatVersionId = (id: string | null): string => {
  if (!id) return 'N/A';
  // Take first 8 characters of the hex string for display
  return id.substring(0, 8).toUpperCase();
};

export const UpdateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isUpdateAvailable: false,
    lastChecked: null,
    currentVersion: formatVersionId(Updates.manifest?.id ?? null),
    updateDetails: null,
    error: null,
    isLoading: false,
    updateProgress: 0
  });

  const checkForUpdates = async (): Promise<void> => {
    setUpdateInfo(prevInfo => ({ 
      ...prevInfo, 
      isLoading: true, 
      error: null 
    }));
    
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        const manifest = await Updates.manifest;
        const updateDetails: UpdateDetails = {
          version: formatVersionId(manifest?.id ?? 'Unknown'),
          description: (manifest as any)?.extra?.description ?? 'No description available',
          size: (manifest as any)?.extra?.size ?? 'Unknown',
          releaseDate: new Date().toISOString()
        };

        setUpdateInfo(prevInfo => ({
          ...prevInfo,
          isUpdateAvailable: true,
          lastChecked: new Date().toISOString(),
          updateDetails,
          isLoading: false
        }));
      } else {
        setUpdateInfo(prevInfo => ({
          ...prevInfo,
          isUpdateAvailable: false,
          lastChecked: new Date().toISOString(),
          isLoading: false
        }));
      }
    } catch (error) {
      setUpdateInfo(prevInfo => ({
        ...prevInfo,
        error: error instanceof Error ? error.message : 'Check for updates failed',
        isLoading: false
      }));
    }
  };

  const performUpdate = async (): Promise<void> => {
    setUpdateInfo(prevInfo => ({ 
      ...prevInfo, 
      isLoading: true, 
      error: null,
      updateProgress: 0 
    }));

    try {
      // Download update with progress tracking
      const update = await Updates.fetchUpdateAsync();

      if (!update) {
        throw new Error('Update download failed');
      }

      // Apply update
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateInfo(prevInfo => ({
        ...prevInfo,
        error: error instanceof Error ? error.message : 'Update failed',
        isLoading: false,
        updateProgress: 0
      }));
    }
  };

  // Initial update check on component mount
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