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
    currentVersion: null,
    updateDetails: null,
    error: null
  });

  const checkForUpdates = async (): Promise<void> => {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      setUpdateInfo(prev => ({
        ...prev,
        isUpdateAvailable: update.isAvailable,
        lastChecked: new Date().toISOString(),
        currentVersion: update.isAvailable ? new Date().toISOString() : null, // Set to null if no update is available
        error: null
      }));
  
      if (update.isAvailable) {
        const updateDetails = await fetchUpdateDetails(update);
        setUpdateInfo(prev => ({
          ...prev,
          updateDetails
        }));
      }
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };
  const performUpdate = async (): Promise<void> => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Update failed'
      }));
    }
  };

  const fetchUpdateDetails = async (update: Updates.Update): Promise<UpdateDetails> => {
    const manifest = await Updates.getManifestAsync();
    return {
      version: manifest.version,
      description: manifest.description,
      size: manifest.size,
      releaseDate: manifest.releaseDate
    };
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

export default UpdateContext;