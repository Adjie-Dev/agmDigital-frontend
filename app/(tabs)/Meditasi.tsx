import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Meditasi = () => {
    const screenWidth = Dimensions.get('window').width;
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
    const [videoPosition, setVideoPosition] = useState<number>(0);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const videoRef = React.useRef<Video>(null);

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

        {/* Header dengan Controls */}
        <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
            <View className="flex-row items-center justify-between mb-3">
            <Text className="text-2xl font-bold text-yellow-700"><FontAwesome5 name="spa" size={20} color="#ca8a04" /> Meditasi Satipathana</Text>
            </View>

            <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
            <FontAwesome5 name="clock" size={12} color="#854d0e" style={{ marginRight: 6 }} />
            <Text className="text-yellow-800 text-sm font-medium">Kapan Saja</Text>
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
                    <Text className="text-white font-bold text-base">Video Panduan Meditasi Satipathana</Text>
                    </View>
                </View>

                <View className="bg-black">
                    <Video
                    ref={videoRef}
                            source={require('@/assets/videos/meditasi.mp4')}
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

                            {/* Controls Row */}
                            <View className="flex-row items-center justify-between">
                                {/* Play/Pause Button */}
                                <TouchableOpacity
                                onPress={handleVideoPlayPause}
                                className="mr-3 p-1"
                                >
                                <FontAwesome5
                                    name={isVideoPlaying ? "pause" : "play"}
                                    size={22}
                                    color="white"
                                />
                                </TouchableOpacity>

                                {/* Time Display */}
                                <Text className="text-white text-sm font-medium flex-1">
                                {formatTime(videoPosition)} / {formatTime(videoDuration)}
                                </Text>

                                {/* Volume/Mute Button */}
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

            {/* Footer */}
            <View className="mx-4 mb-6 bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
            <View className="items-center">
                <Text className="text-xl font-bold text-yellow-800 mb-2">Selesaikan Persiapan Meditasi</Text>
                <Text className="text-yellow-700 text-center mb-4 leading-6">
                Setelah menyelesaikan semua tahap persiapan, Anda siap untuk memulai meditasi Anapanasati.
                </Text>
                <View className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                <Text className="text-yellow-900 italic text-center font-bold text-base">
                    {"Bhavatu Sabba Mangalam"}
                </Text>
                <Text className="text-yellow-800 text-center text-sm mt-1 font-medium">
                    {"Semoga semua berkah menyertai Anda"}
                </Text>
                </View>
            </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Meditasi;