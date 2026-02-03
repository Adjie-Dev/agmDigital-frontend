import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

interface AudioDownloadState {
  [key: string]: {
    localUri: string | null;
    isDownloading: boolean;
    progress: number;
  };
}

export const useAudioDownload = () => {
  const [audioStates, setAudioStates] = useState<AudioDownloadState>({});

  // Fungsi untuk mendapatkan nama file dari URL
  const getAudioFileName = (url: string): string => {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  };

  // Fungsi untuk mendapatkan path lokal
  const getLocalAudioPath = (url: string): string => {
    const fileName = getAudioFileName(url);
    return `${FileSystem.documentDirectory}audio_${fileName}`;
  };

  // Fungsi untuk cek apakah audio sudah ada di lokal
  const checkLocalAudio = async (url: string): Promise<string | null> => {
    try {
      const localPath = getLocalAudioPath(url);
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (fileInfo.exists) {
        return localPath;
      }
      return null;
    } catch (error) {
      console.error('Error checking local audio:', error);
      return null;
    }
  };

  // Fungsi untuk download audio di background TANPA NOTIFIKASI
  const downloadAudioInBackground = async (url: string) => {
    try {
      const localPath = getLocalAudioPath(url);

      // Update state: mulai download
      setAudioStates(prev => ({
        ...prev,
        [url]: {
          localUri: null,
          isDownloading: true,
          progress: 0
        }
      }));

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          const progressPercent = Math.round(progress * 100);
          
          // Update progress TANPA NOTIFIKASI
          setAudioStates(prev => ({
            ...prev,
            [url]: {
              ...prev[url],
              progress: progressPercent
            }
          }));
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        // Update state: download selesai
        setAudioStates(prev => ({
          ...prev,
          [url]: {
            localUri: result.uri,
            isDownloading: false,
            progress: 100
          }
        }));

        console.log('Audio downloaded successfully:', result.uri);
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
      
      // Update state: download gagal
      setAudioStates(prev => ({
        ...prev,
        [url]: {
          localUri: null,
          isDownloading: false,
          progress: 0
        }
      }));
    }
  };

  // Fungsi untuk initialize semua audio dari array PujaPagi
  const initializeAllAudios = async (audioUrls: string[]) => {
    for (const url of audioUrls) {
      await initializeAudio(url);
    }
  };

  // Fungsi untuk initialize audio (cek lokal, download jika belum ada)
  const initializeAudio = async (url: string) => {
    try {
      // Cek apakah sudah ada di lokal
      const localUri = await checkLocalAudio(url);
      
      if (localUri) {
        // Sudah ada di lokal
        setAudioStates(prev => ({
          ...prev,
          [url]: {
            localUri: localUri,
            isDownloading: false,
            progress: 100
          }
        }));
      } else {
        // Belum ada, download di background
        downloadAudioInBackground(url);
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  // Fungsi untuk mendapatkan URI yang akan digunakan
  const getAudioUri = (url: string): string => {
    const state = audioStates[url];
    
    // Jika sudah ada di lokal, gunakan local URI
    if (state?.localUri) {
      return state.localUri;
    }
    
    // Jika belum, gunakan URL asli (streaming)
    return url;
  };

  // Fungsi untuk cek apakah audio sudah tersedia offline
  const isAudioOffline = (url: string): boolean => {
    return audioStates[url]?.localUri !== null;
  };

  return {
    initializeAudio,
    initializeAllAudios,
    getAudioUri,
    isAudioOffline,
    audioStates
  };
};