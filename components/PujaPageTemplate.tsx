import { useAudioDownload } from '@/hooks/useAudioDownload';
import { useNotificationTray } from '@/hooks/useDownloadNotification';
import { Audio, ResizeMode, Video } from 'expo-av';
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

interface PujaSection {
    title: string;
    description: string;
    duration: string;
    audioUrl: string;
    paliText: string;
    translation: string;
}

interface PujaPageProps {
    title: string;
    subtitle: string;
    videoUrl: string;
    videoFilename: string;
    videoTitle: string;
    sections: PujaSection[];
    preparationContent: React.ReactNode;
    footerTitle: string;
    footerDescription: string;
    previewText: string;
    textLabel: string;
}

const PujaPageTemplate: React.FC<PujaPageProps> = ({
    title,
    subtitle,
    videoUrl,
    videoFilename,
    videoTitle,
    sections,
    preparationContent,
    footerTitle,
    footerDescription,
    previewText,
    textLabel,
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [fontSize, setFontSize] = useState<number>(16);
    const [audioPosition, setAudioPosition] = useState<number>(0);
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [sectionTranslations, setSectionTranslations] = useState<{[key: number]: boolean}>({});
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
    const [videoPosition, setVideoPosition] = useState<number>(0);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [videoUri, setVideoUri] = useState<string>(videoUrl);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    
    const videoRef = React.useRef<Video>(null);
    const soundRef = React.useRef<Audio.Sound | null>(null);
    const screenWidth = Dimensions.get('window').width;

    const { 
        showProgressNotification, 
        showSuccessNotification, 
        showErrorNotification 
    } = useNotificationTray();

    const { 
        initializeAllAudios, 
        getAudioUri, 
        isAudioOffline 
    } = useAudioDownload();

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

    useEffect(() => {
        const audioUrls = sections.map(section => section.audioUrl);
        initializeAllAudios(audioUrls);
    }, []);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

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

    const handleSeek = async (percentage: number) => {
        if (videoRef.current && videoDuration > 0) {
            const newPosition = videoDuration * percentage;
            await videoRef.current.setPositionAsync(newPosition);
        }
    };

    const toggleMute = async () => {
        if (videoRef.current) {
            await videoRef.current.setIsMutedAsync(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatTimeFromSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 1000 / 60);
        const secs = Math.floor((seconds / 1000) % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setVideoPosition(status.positionMillis || 0);
            setVideoDuration(status.durationMillis || 0);
            setIsVideoPlaying(status.isPlaying);
        }
    };

    const handlePlayPause = async (index: number) => {
        try {
            if (currentTrack === index && isPlaying) {
                await soundRef.current?.pauseAsync();
                setIsPlaying(false);
            } else if (currentTrack === index && !isPlaying) {
                await soundRef.current?.playAsync();
                setIsPlaying(true);
            } else {
                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                }

                setAudioPosition(0);
                setAudioDuration(0);

                const audioUri = getAudioUri(sections[index].audioUrl);

                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true }
                );

                soundRef.current = sound;
                setCurrentTrack(index);
                setIsPlaying(true);

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setAudioPosition(status.positionMillis || 0);
                        setAudioDuration(status.durationMillis || 0);
                        
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            setCurrentTrack(null);
                            setAudioPosition(0);
                            setAudioDuration(0);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const adjustFontSize = (increase: boolean) => {
        setFontSize(prev => {
            const newSize = increase ? prev + 2 : prev - 2;
            return Math.max(12, Math.min(24, newSize));
        });
    };

    const getFontSizeLabel = () => {
        if (fontSize <= 12) return 'Kecil';
        if (fontSize <= 16) return 'Sedang';
        if (fontSize <= 20) return 'Besar';
        return 'Sangat Besar';
    };

    const toggleSectionTranslation = (sectionIndex: number) => {
        setSectionTranslations(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    const isSectionTranslationVisible = (sectionIndex: number) => {
        return sectionTranslations[sectionIndex] ?? false;
    };

    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            {/* Header */}
            <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-yellow-700">
                        <FontAwesome5 name="sun" size={20} color="#ca8a04" /> {title}
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

                {/* Font Size Section */}
                <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
                    <View className="bg-yellow-600 p-4 rounded-t-xl">
                        <View className="flex-row items-center">
                            <View className="bg-yellow-500 p-2 rounded-full mr-3">
                                <FontAwesome5 name="text-height" size={16} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg">Pengaturan Tampilan</Text>
                                <Text className="text-yellow-100 text-sm">Sesuaikan ukuran teks</Text>
                            </View>
                        </View>
                    </View>

                    <View className="p-4 bg-amber-50">
                        <View className="mb-4">
                            <View className="flex-row items-center mb-3">
                                <FontAwesome5 name="font" size={14} color="#854d0e" style={{ marginRight: 8 }} />
                                <Text className="text-yellow-800 font-semibold">Ukuran Huruf</Text>
                                <View className="ml-2 bg-yellow-200 px-2 py-1 rounded-full">
                                    <Text className="text-yellow-800 text-xs font-medium">{getFontSizeLabel()}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between bg-white p-3 rounded-lg border-2 border-yellow-300">
                                <TouchableOpacity
                                    onPress={() => adjustFontSize(false)}
                                    className={`flex-row items-center justify-center p-3 rounded-lg ${
                                        fontSize <= 12 ? 'bg-gray-200' : 'bg-yellow-100'
                                    }`}
                                    disabled={fontSize <= 12}
                                    style={{ flex: 1, marginRight: 8 }}
                                >
                                    <FontAwesome5
                                        name="minus"
                                        size={16}
                                        color={fontSize <= 12 ? '#9ca3af' : '#854d0e'}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text className={`font-semibold ${fontSize <= 12 ? 'text-gray-400' : 'text-yellow-800'}`}>
                                        Kecil
                                    </Text>
                                </TouchableOpacity>

                                <View className="px-4">
                                    <View className="flex-row items-center" style={{ gap: 4 }}>
                                        {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                                            <View
                                                key={size}
                                                className={`w-2 h-2 rounded-full ${
                                                    fontSize === size ? 'bg-yellow-600' : 'bg-yellow-300'
                                                }`}
                                            />
                                        ))}
                                    </View>
                                    <Text className="text-center text-yellow-700 text-xs mt-1 font-medium">
                                        {fontSize}px
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => adjustFontSize(true)}
                                    className={`flex-row items-center justify-center p-3 rounded-lg ${
                                        fontSize >= 24 ? 'bg-gray-200' : 'bg-yellow-100'
                                    }`}
                                    disabled={fontSize >= 24}
                                    style={{ flex: 1, marginLeft: 8 }}
                                >
                                    <FontAwesome5
                                        name="plus"
                                        size={16}
                                        color={fontSize >= 24 ? '#9ca3af' : '#854d0e'}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text className={`font-semibold ${fontSize >= 24 ? 'text-gray-400' : 'text-yellow-800'}`}>
                                        Besar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                            <Text className="text-yellow-700 text-xs font-bold mb-2 tracking-wide">PRATINJAU:</Text>
                            <Text
                                className="text-yellow-900"
                                style={{
                                    fontSize: fontSize,
                                    lineHeight: fontSize * 1.6,
                                    fontFamily: 'serif',
                                }}
                            >
                                {previewText}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Puja Sections */}
                {sections.map((section, index) => (
                    <View key={index} className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
                        <View className="bg-red-900 p-4 rounded-t-xl">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg mb-1">{section.title}</Text>
                                    <Text className="text-yellow-200 text-sm">{section.description}</Text>
                                </View>
                                <View className="items-end">
                                    <View className="bg-yellow-500 px-3 py-1 rounded-full">
                                        <Text className="text-yellow-900 text-xs font-bold">{section.duration}</Text>
                                    </View>
                                    {isAudioOffline(section.audioUrl)}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => toggleSectionTranslation(index)}
                                className="flex-row items-center justify-between bg-yellow-600 bg-opacity-40 p-3 rounded-lg border-2 border-yellow-500 border-opacity-50"
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-5 h-5 rounded-full mr-3 border-2 items-center justify-center ${
                                        isSectionTranslationVisible(index) ? 'bg-white border-white' : 'bg-transparent border-yellow-200'
                                    }`}>
                                        {isSectionTranslationVisible(index) && (
                                            <FontAwesome5 name="check" size={12} color="#ca8a04" />
                                        )}
                                    </View>
                                    <Text className={`font-semibold ${isSectionTranslationVisible(index) ? 'text-white' : 'text-yellow-100'}`}>
                                        {isSectionTranslationVisible(index) ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}
                                    </Text>
                                </View>
                                <FontAwesome5
                                    name={isSectionTranslationVisible(index) ? "eye-slash" : "eye"}
                                    size={16}
                                    color={isSectionTranslationVisible(index) ? 'white' : '#fef08a'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="p-4 bg-amber-50">
                            <View className="mb-4">
                                <TouchableOpacity
                                    onPress={() => handlePlayPause(index)}
                                    className={`flex-row items-center justify-center py-3 px-4 rounded-lg ${
                                        currentTrack === index && isPlaying
                                            ? 'bg-red-800'
                                            : 'bg-yellow-100 border-2 border-yellow-300'
                                    }`}
                                >
                                    <FontAwesome5
                                        name={currentTrack === index && isPlaying ? "pause" : "play"}
                                        size={16}
                                        color={currentTrack === index && isPlaying ? "white" : "#854d0e"}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text className={`font-semibold ${
                                        currentTrack === index && isPlaying ? 'text-white' : 'text-yellow-800'
                                    }`}>
                                        {currentTrack === index && isPlaying ? 'Jeda Audio' : 'Putar Audio'}
                                    </Text>
                                </TouchableOpacity>

                                {currentTrack === index && isPlaying && (
                                    <View className="mt-3 p-3 bg-white rounded-lg border border-yellow-300">
                                        <View className="flex-row items-center">
                                            <FontAwesome5 name="volume-up" size={14} color="#854d0e" style={{ marginRight: 8 }} />
                                            <View className="flex-1 bg-yellow-200 rounded-full h-2 mr-3">
                                                <View 
                                                    className="bg-red-800 h-2 rounded-full" 
                                                    style={{ 
                                                        width: audioDuration > 0 ? `${(audioPosition / audioDuration) * 100}%` : '0%' 
                                                    }} 
                                                />
                                            </View>
                                            <Text className="text-xs text-yellow-800 font-medium">
                                                {formatTimeFromSeconds(audioPosition)} / {formatTimeFromSeconds(audioDuration)}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View className="mb-4">
                                <View className="flex-row items-start mb-3">
                                    <FontAwesome5 name="book" size={16} color="#854d0e" style={{ marginRight: 8 }} />
                                    <Text className="text-yellow-800 font-bold">{textLabel}</Text>
                                </View>
                                <View className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                                    {section.paliText.split('\n').map((line, lineIndex) => {
                                        const trimmedLine = line.trim();

                                        if (trimmedLine === '') {
                                            return <View key={lineIndex} style={{ height: 12 }} />;
                                        }

                                        const textContent = trimmedLine.startsWith('•') 
                                            ? trimmedLine.substring(1).trim() 
                                            : trimmedLine;

                                        return (
                                            <View key={lineIndex} className="flex-row mb-2" style={{ paddingLeft: 4 }}>
                                                <Text
                                                    className="text-yellow-900"
                                                    style={{
                                                        fontSize: fontSize,
                                                        lineHeight: fontSize * 1.6,
                                                        fontFamily: 'serif',
                                                        fontWeight: 'bold',
                                                        marginRight: 8,
                                                    }}
                                                >
                                                    •
                                                </Text>
                                                <Text
                                                    className="text-yellow-900 flex-1"
                                                    style={{
                                                        fontSize: fontSize,
                                                        lineHeight: fontSize * 1.6,
                                                        fontFamily: 'serif',
                                                    }}
                                                >
                                                    {textContent}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {isSectionTranslationVisible(index) && (
                                <View>
                                    <View className="flex-row items-center mb-3">
                                        <FontAwesome5 name="language" size={16} color="#7f1d1d" style={{ marginRight: 8 }} />
                                        <Text className="text-red-900 font-bold">Terjemahan</Text>
                                    </View>
                                    <View className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                                        {section.translation.split('\n').map((line, lineIndex) => {
                                            const trimmedLine = line.trim();

                                            if (trimmedLine === '') {
                                                return <View key={lineIndex} style={{ height: 12 }} />;
                                            }

                                            const textContent = trimmedLine.startsWith('•') 
                                                ? trimmedLine.substring(1).trim() 
                                                : trimmedLine;

                                            return (
                                                <View key={lineIndex} className="flex-row mb-2" style={{ paddingLeft: 4 }}>
                                                    <Text
                                                        className="text-red-900"
                                                        style={{
                                                            fontSize: fontSize - 1,
                                                            lineHeight: (fontSize - 1) * 1.5,
                                                            fontWeight: 'bold',
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        •
                                                    </Text>
                                                    <Text
                                                        className="text-red-900 flex-1"
                                                        style={{
                                                            fontSize: fontSize - 1,
                                                            lineHeight: (fontSize - 1) * 1.5,
                                                        }}
                                                    >
                                                        {textContent}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ))}

                {/* Footer */}
                <View className="mx-4 mb-6 bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
                    <View className="items-center">
                        <Text className="text-xl font-bold text-yellow-800 mb-2">{footerTitle}</Text>
                        <Text className="text-yellow-700 text-center mb-4 leading-6">
                            {footerDescription}
                        </Text>
                        <View className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                            <Text className="text-yellow-900 italic text-center font-bold text-base">
                                {"Sabbe satta bhavantu sukhitatta"}
                            </Text>
                            <Text className="text-yellow-800 text-center text-sm mt-1 font-medium">
                                {"Semoga semua makhluk berbahagia"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PujaPageTemplate;