import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// IDENTIFIER TETAP - Biar notif REPLACE, bukan bikin baru
const DOWNLOAD_NOTIFICATION_ID = 'download-progress-notification';

// Konfigurasi bagaimana notifikasi ditampilkan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

export const useNotificationTray = () => {
  // Request permission saat pertama kali
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('download', {
          name: 'Download Progress',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0],
          lightColor: '#FF231F7C',
          sound: null,
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission untuk notifikasi ditolak');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  // Show progress notification - PAKAI IDENTIFIER TETAP BIAR REPLACE!
  const showProgressNotification = async (
    title: string,
    progress: number,
    body?: string
  ) => {
    try {
      // KUNCI: Pakai identifier yang SAMA biar REPLACE notif lama
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📥 ${title}`,
          body: body ? `${body} - ${progress}%` : `Progress: ${progress}%`,
          data: { progress, type: 'progress' },
          sound: false,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          sticky: Platform.OS === 'android', // Android: ga bisa di-swipe
        },
        trigger: null,
        identifier: DOWNLOAD_NOTIFICATION_ID, // ← INI KUNCINYA! ID TETAP!
      });
    } catch (error) {
      console.error('Error showing progress notification:', error);
    }
  };

  // Show success notification
  const showSuccessNotification = async (
    title: string,
    body: string,
    autoDismiss: number = 3000
  ) => {
    try {
      // HAPUS notif download dulu
      await Notifications.dismissNotificationAsync(DOWNLOAD_NOTIFICATION_ID);
      
      // Tunggu sebentar biar ga bentrok
      await new Promise(resolve => setTimeout(resolve, 200));

      // Buat success notification dengan ID BEDA
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `✅ ${title}`,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'success' },
        },
        trigger: null,
        identifier: 'download-success-notification', // ID beda dari progress
      });

      // Auto dismiss setelah beberapa detik
      if (autoDismiss > 0) {
        setTimeout(async () => {
          try {
            await Notifications.dismissNotificationAsync('download-success-notification');
          } catch (e) {
            console.log('Notif sudah hilang');
          }
        }, autoDismiss);
      }
    } catch (error) {
      console.error('Error showing success notification:', error);
    }
  };

  // Show error notification
  const showErrorNotification = async (
    title: string,
    body: string,
    autoDismiss: number = 5000
  ) => {
    try {
      // HAPUS notif download dulu
      await Notifications.dismissNotificationAsync(DOWNLOAD_NOTIFICATION_ID);
      
      // Tunggu sebentar biar ga bentrok
      await new Promise(resolve => setTimeout(resolve, 200));

      // Buat error notification dengan ID BEDA
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `❌ ${title}`,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'error' },
        },
        trigger: null,
        identifier: 'download-error-notification', // ID beda dari progress
      });

      // Auto dismiss setelah beberapa detik
      if (autoDismiss > 0) {
        setTimeout(async () => {
          try {
            await Notifications.dismissNotificationAsync('download-error-notification');
          } catch (e) {
            console.log('Notif sudah hilang');
          }
        }, autoDismiss);
      }
    } catch (error) {
      console.error('Error showing error notification:', error);
    }
  };

  // Show info notification
  const showInfoNotification = async (
    title: string,
    body: string,
    autoDismiss: number = 3000
  ) => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `ℹ️ ${title}`,
          body,
          sound: false,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
          data: { type: 'info' },
        },
        trigger: null,
        identifier: `info-notification-${Date.now()}`, // ID unik untuk info
      });

      if (autoDismiss > 0) {
        setTimeout(async () => {
          try {
            await Notifications.dismissNotificationAsync(identifier);
          } catch (e) {
            console.log('Notif sudah hilang');
          }
        }, autoDismiss);
      }
    } catch (error) {
      console.error('Error showing info notification:', error);
    }
  };

  // Dismiss current notification
  const dismissNotification = async () => {
    try {
      await Notifications.dismissNotificationAsync(DOWNLOAD_NOTIFICATION_ID);
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return {
    showProgressNotification,
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    dismissNotification,
  };
};