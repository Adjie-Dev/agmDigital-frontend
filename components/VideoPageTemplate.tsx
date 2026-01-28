import { useNotificationTray } from '@/hooks/useDownloadNotification';
import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface VideoPageProps {
  title: string;
  subtitle: string;
  videoUrl: string;
  videoFilename: string;
  videoTitle: string;
  icon?: string;
  preparationContent: React.ReactNode;
  footerTitle: string;
  footerDescription: string;
  footerQuote: string;
  footerQuoteTranslation: string;
}

const VideoPageTemplate: React.FC<VideoPageProps> = ({
  title,
  subtitle,
  videoUrl,
  videoFilename,
  videoTitle,
  icon = "sun",
  preparationContent,
  footerTitle,
  footerDescription,
  footerQuote,
  footerQuoteTranslation,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoPosition, setVideoPosition] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string>(videoUrl);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  
  const videoRef = React.useRef<Video>(null);

  const { 
    showProgressNotification, 
    showSuccessNotification, 
    showErrorNotification 
  } = useNotificationTray();

  const getLocalVideoPath = () => {
    return `${FileSystem.documentDirectory}${videoFilename}`;
  };

  const initializeVideo = async () => {
    try {
      const localPath = getLocalVideoPath();
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (fileInfo.exists) {
        setVideoUri(localPath);
      } else {
        await downloadVideoInBackground();
      }
    } catch (error) {
      console.error('Error initializing video:', error);
      Alert.alert('Error', 'Gagal initialize video: ' + error);
    }
  };

  const downloadVideoInBackground = async () => {
    try {
      setIsDownloading(true);
      const localPath = getLocalVideoPath();
      
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        localPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          const progressPercent = Math.round(progress * 100);
          setDownloadProgress(progressPercent);
          
          showProgressNotification(
            `Mengunduh Video ${title}`,
            progressPercent,
            'Video dapat diputar saat mengunduh'
          );
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        setVideoUri(result.uri);
        setIsDownloading(false);
        
        showSuccessNotification(
          'Download Selesai!',
          'Video tersimpan untuk mode offline'
        );
      }
    } catch (error) {
      console.error('Error downloading video:', error);
      
      showErrorNotification(
        'Download Gagal',
        'Gagal download video: ' + error
      );
      
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    initializeVideo();
  }, []);

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleVideoPlayPause = async () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setVideoPosition(status.positionMillis || 0);
      setVideoDuration(status.durationMillis || 0);
      setIsVideoPlaying(status.isPlaying);
    }
  };

  const handleSeek = async (percentage: number) => {
    if (videoRef.current && videoDuration > 0) {
      const newPosition = videoDuration * percentage;
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

      {/* Header */}
      <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-yellow-700">
            <FontAwesome5 name={icon} size={20} color="#ca8a04" /> {title}
          </Text>
        </View>

        <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
          <FontAwesome5 name="clock" size={12} color="#854d0e" style={{ marginRight: 6 }} />
          <Text className="text-yellow-800 text-sm font-medium">{subtitle}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Video Section */}
        <View className="bg-white mx-4 my-4 rounded-xl shadow-lg overflow-hidden border border-yellow-200">
          <View className="bg-red-800 px-4 py-3">
            <View className="flex-row items-center">
              <View className="bg-red-700 p-2 rounded-lg mr-3">
                <FontAwesome5 name="youtube" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-base">{videoTitle}</Text>
            </View>
          </View>

          <View className="bg-black">
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={{
                width: screenWidth - 32,
                height: (screenWidth - 32) * 9 / 16,
                backgroundColor: '#000',
              }}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />

            <View className="bg-gray-900 px-4 py-3">
              <TouchableOpacity 
                activeOpacity={0.8}
                className="mb-3"
                onPress={(e) => {
                  const locationX = e.nativeEvent.locationX;
                  const width = screenWidth - 32 - 32;
                  const percentage = locationX / width;
                  handleSeek(percentage);
                }}
              >
                <View className="bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <View 
                    className="bg-red-600 h-1.5" 
                    style={{ 
                      width: videoDuration > 0 ? `${(videoPosition / videoDuration) * 100}%` : '0%' 
                    }} 
                  />
                </View>
              </TouchableOpacity>

              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={handleVideoPlayPause} className="mr-3 p-1">
                  <FontAwesome5
                    name={isVideoPlaying ? "pause" : "play"}
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>

                <Text className="text-white text-sm font-medium flex-1">
                  {formatTime(videoPosition)} / {formatTime(videoDuration)}
                </Text>

                <TouchableOpacity onPress={toggleMute} className="ml-3 p-1">
                  <FontAwesome5
                    name={isMuted ? "volume-mute" : "volume-up"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Persiapan Section */}
        <View className="flex-row mx-4 mb-4 space-x-4">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-md border-2 border-yellow-400 items-center">
            {preparationContent}
          </View>
        </View>

        {/* Footer */}
        <View className="mx-4 mb-6 bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="items-center">
            <Text className="text-xl font-bold text-yellow-800 mb-2">{footerTitle}</Text>
            <Text className="text-yellow-700 text-center mb-4 leading-6">
              {footerDescription}
            </Text>
            <View className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
              <Text className="text-yellow-900 italic text-center font-bold text-base">
                {footerQuote}
              </Text>
              <Text className="text-yellow-800 text-center text-sm mt-1 font-medium">
                {footerQuoteTranslation}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoPageTemplate;