import { Amithuocing } from '@/pujaData/Amithuocing';
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
import WebView from 'react-native-webview';

const AmithuocingPage = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [fontSize, setFontSize] = useState<number>(16);
    const [sectionTranslations, setSectionTranslations] = useState<{[key: number]: boolean}>({});
    const screenWidth = Dimensions.get('window').width;
    const videoHeight = (screenWidth - 32) * 9 / 16;

    const handlePlayPause = (index: number) => {
        if (currentTrack === index && isPlaying) {
        setIsPlaying(false);
        setCurrentTrack(null);
        } else {
        setIsPlaying(true);
        setCurrentTrack(index);
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

        {/* Header*/}
        <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
            <View className="flex-row items-center justify-between mb-3">
            <Text className="text-2xl font-bold text-yellow-700"><FontAwesome5 name="sun" size={20} color="#ca8a04" /> Amitabha Sutra</Text>
            </View>

            <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
            <FontAwesome5 name="clock" size={12} color="#854d0e" style={{ marginRight: 6 }} />
            <Text className="text-yellow-800 text-sm font-medium">Waktu Terbaik: 05:00 - 07:00 WIB</Text>
            </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Video Section */}
            <View className="bg-white mx-4 my-4 rounded-xl shadow-md border-2 border-yellow-300">
            <View className="bg-red-800 p-4 rounded-t-xl">
                <View className="flex-row items-center">
                <FontAwesome5 name="youtube" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-semibold text-base">Video Panduan Amitabha Sutra</Text>
                </View>
            </View>
            <View className="p-4 bg-amber-50">
                <WebView
                source={{ uri: 'https://www.youtube.com/embed/xmep1pDou_0' }}
                style={{
                    width: screenWidth - 64,
                    height: videoHeight - 32,
                    borderRadius: 8,
                }}
                allowsFullscreenVideo
                />
            </View>
            </View>

            {/* Persiapan Section */}
            <View className="flex-row mx-4 mb-4 space-x-4">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-md border-2 border-yellow-400 items-center">
                <Text className="text-3xl font-bold text-yellow-600">Persiapan</Text>
                <Text className="text-yellow-700 text-sm font-semibold">• Duduk dengan posisi nyaman (bersila atau di kursi)</Text>
                <Text className="text-yellow-700 text-sm font-semibold">• Tenangkan pikiran beberapa detik</Text>
                <Text className="text-yellow-700 text-sm font-semibold">• Nyalakan lilin dandupa (opsional)</Text>
            </View>
            </View>

            {/* Enhanced Custom Font Section */}
            <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
            {/* Header */}
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

            {/* Content */}
            <View className="p-4 bg-amber-50">
                {/* Font Size Controls */}
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

                    {/* Font Size Indicator */}
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

                {/* Preview Text */}
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
                    Fó Shuō A Mi Tuó JĪng
                </Text>
                </View>
            </View>
            </View>

            {/* Puja Sections */}
            {Amithuocing.map((section, index) => (
            <View key={index} className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
                {/* Section Header */}
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
                    </View>
                </View>

                {/* Translation Toggle */}
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
                {/* Audio Controls */}
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

                    {/* Audio Progress */}
                    {currentTrack === index && isPlaying && (
                    <View className="mt-3 p-3 bg-white rounded-lg border border-yellow-300">
                        <View className="flex-row items-center">
                        <FontAwesome5 name="volume-up" size={14} color="#854d0e" style={{ marginRight: 8 }} />
                        <View className="flex-1 bg-yellow-200 rounded-full h-2 mr-3">
                            <View className="bg-red-800 h-2 rounded-full" style={{ width: '33%' }} />
                        </View>
                        <Text className="text-xs text-yellow-800 font-medium">1:15 / {section.duration}</Text>
                        </View>
                    </View>
                    )}
                </View>

                {/* Pali Text */}
                {/* Pali Text */}
                <View className="mb-4">
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="book" size={16} color="#854d0e" style={{ marginRight: 8 }} />
                    <Text className="text-yellow-800 font-bold">Teks Mandarin</Text>
                </View>
                <View className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                    {section.paliText.split('\n').map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    
                    // Skip empty lines
                    if (trimmedLine === '') {
                        return <View key={lineIndex} style={{ height: 12 }} />;
                    }
                    
                    // Remove existing bullet if present
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

                {/* Translation */}
                {isSectionTranslationVisible(index) && (
                <View>
                    <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="language" size={16} color="#7f1d1d" style={{ marginRight: 8 }} />
                    <Text className="text-red-900 font-bold">Terjemahan</Text>
                    </View>
                    <View className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    {section.translation.split('\n').map((line, lineIndex) => {
                        const trimmedLine = line.trim();
                        
                        // Skip empty lines
                        if (trimmedLine === '') {
                        return <View key={lineIndex} style={{ height: 12 }} />;
                        }
                        
                        // Remove existing bullet if present
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
                <Text className="text-xl font-bold text-yellow-800 mb-2">Selesaikan Amitabha Sutra</Text>
                <Text className="text-yellow-700 text-center mb-4 leading-6">
                Setelah menyelesaikan semua bagian sutra, dedikasikan merit untuk semua makhluk hidup.
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

export default AmithuocingPage;