import GoogleDriveService from '@/hooks/Googledriveservice';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';

interface Ebook {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    category: string;
    pages: number;
    fileSize: string;
    language: string;
    publishedDate: string;
    content?: string;
    downloadUrl?: string;
    driveFileId?: string;
}

interface EbookDetailViewProps {
    ebook: Ebook;
    onBack: () => void;
}

const EbookDetailView: React.FC<EbookDetailViewProps> = ({ ebook, onBack }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(16);
    const [viewMode, setViewMode] = useState<'info' | 'read'>('info');
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const webViewRef = useRef<WebView>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const adjustFontSize = (increment: number) => {
        const newSize = fontSize + increment;
        if (newSize >= 12 && newSize <= 24) {
            setFontSize(newSize);
        }
    };

    const handleDownload = async () => {
        try {
            if (ebook.downloadUrl) {
                const supported = await Linking.canOpenURL(ebook.downloadUrl);
                
                if (supported) {
                    await Linking.openURL(ebook.downloadUrl);
                } else {
                    Alert.alert('Error', 'Tidak dapat membuka link download');
                }
            } else {
                Alert.alert('Error', 'Link download tidak tersedia');
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Gagal mendownload ebook');
        }
    };

    // Dummy content
    const ebookContent = ebook.content || `
        <h2>Pendahuluan</h2>
        <p>Ini adalah konten e-book yang akan ditampilkan. Untuk PDF, konten akan ditampilkan melalui PDF viewer.</p>
        
        <h3>Bab 1: Pengantar Dharma</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        <h3>Bab 2: Praktik Meditasi</h3>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        
        <h3>Bab 3: Kebijaksanaan Buddha</h3>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
        
        <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
        
        <h2>Kesimpulan</h2>
        <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
    `;

    const renderContent = () => {
        const lines = ebookContent.split('\n').filter(line => line.trim());
        
        return lines.map((line, index) => {
            line = line.trim();
            
            if (line.startsWith('<h2>')) {
                const text = line.replace(/<\/?h2>/g, '');
                return (
                    <Text key={index} style={{ fontSize: fontSize + 4 }} className="text-yellow-900 font-bold mb-3 mt-4">
                        {text}
                    </Text>
                );
            } else if (line.startsWith('<h3>')) {
                const text = line.replace(/<\/?h3>/g, '');
                return (
                    <Text key={index} style={{ fontSize: fontSize + 2 }} className="text-yellow-800 font-bold mb-2 mt-3">
                        {text}
                    </Text>
                );
            } else if (line.startsWith('<p>')) {
                const text = line.replace(/<\/?p>/g, '');
                return (
                    <Text key={index} style={{ fontSize, lineHeight: fontSize * 1.6 }} className="text-yellow-900 mb-3 text-justify">
                        {text}
                    </Text>
                );
            }
            return null;
        });
    };

    const renderPdfReader = () => {
        if (!ebook.driveFileId) {
            return (
                <View className="flex-1 items-center justify-center p-4 bg-amber-50">
                    <FontAwesome5 name="file-pdf" size={64} color="#d97706" />
                    <Text className="text-yellow-800 mt-4 text-center font-semibold text-lg">
                        PDF tidak tersedia
                    </Text>
                    <Text className="text-yellow-700 mt-2 text-center">
                        Silakan download untuk membaca offline.
                    </Text>
                </View>
            );
        }

        const pdfViewerUrl = GoogleDriveService.getPdfViewerUrl(ebook.driveFileId);

        return (
            <View className="flex-1 bg-gray-900">
                <WebView
                    ref={webViewRef}
                    source={{ uri: pdfViewerUrl }}
                    style={{ flex: 1, backgroundColor: '#1f2937' }}
                    startInLoadingState={true}
                    onLoadStart={() => setPdfLoading(true)}
                    onLoadEnd={() => setPdfLoading(false)}
                    renderLoading={() => (
                        <View className="flex-1 items-center justify-center bg-gray-900">
                            <ActivityIndicator size="large" color="#ca8a04" />
                            <Text className="text-yellow-500 mt-4 font-semibold text-lg">Memuat PDF...</Text>
                            <Text className="text-gray-400 text-sm mt-2">Harap tunggu sebentar</Text>
                        </View>
                    )}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView error:', nativeEvent);
                        setPdfLoading(false);
                        Alert.alert(
                            'Gagal Memuat PDF',
                            'Tidak dapat memuat PDF. Silakan coba lagi atau download untuk membaca offline.',
                            [
                                { text: 'Download', onPress: handleDownload },
                                { text: 'Coba Lagi', onPress: () => setPdfLoading(true) },
                                { text: 'OK' }
                            ]
                        );
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            {/* HEADER */}
            <View className="bg-white shadow-md border-b-2 border-yellow-600">
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity
                        onPress={onBack}
                        className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-2 flex-row items-center"
                    >
                        <FontAwesome5 name="arrow-left" size={14} color="#854d0e" />
                        <Text className="text-yellow-800 font-semibold ml-2 text-sm">Kembali</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        {/* View Mode Toggle */}
                        <TouchableOpacity
                            onPress={() => {
                                setViewMode(viewMode === 'info' ? 'read' : 'info');
                                if (viewMode === 'info') {
                                    setPdfLoading(true);
                                }
                            }}
                            className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-2 flex-row items-center mr-2"
                        >
                            <FontAwesome5 
                                name={viewMode === 'info' ? 'book-open' : 'info-circle'} 
                                size={12} 
                                color="#854d0e" 
                            />
                            <Text className="text-yellow-800 font-semibold ml-2 text-xs">
                                {viewMode === 'info' ? 'Baca' : 'Info'}
                            </Text>
                        </TouchableOpacity>

                        {/* Font Size Controls (only in info mode) */}
                        {viewMode === 'info' && (
                            <>
                                <TouchableOpacity
                                    onPress={() => adjustFontSize(-2)}
                                    className="bg-yellow-100 border-2 border-yellow-300 rounded-lg w-9 h-9 items-center justify-center mr-2"
                                >
                                    <FontAwesome5 name="minus" size={12} color="#854d0e" />
                                </TouchableOpacity>
                                
                                <Text className="text-yellow-800 font-bold mx-2">{fontSize}</Text>
                                
                                <TouchableOpacity
                                    onPress={() => adjustFontSize(2)}
                                    className="bg-yellow-100 border-2 border-yellow-300 rounded-lg w-9 h-9 items-center justify-center"
                                >
                                    <FontAwesome5 name="plus" size={12} color="#854d0e" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>

            {viewMode === 'read' ? (
                // FULL PDF READER MODE - JUST SCROLL!
                renderPdfReader()
            ) : (
                // INFO & CONTENT MODE
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* COVER & INFO SECTION */}
                    <View className="bg-white border-b-2 border-yellow-300 p-4">
                        <View className="flex-row">
                            {/* Cover Image */}
                            <Image 
                                source={{ uri: ebook.coverImage }}
                                style={{ width: 120, height: 160 }}
                                resizeMode="cover"
                                className="rounded-lg border-2 border-yellow-300"
                            />

                            {/* Info */}
                            <View className="flex-1 ml-4">
                                <View className="bg-yellow-100 px-2 py-1 rounded-full self-start mb-2">
                                    <Text className="text-yellow-800 text-xs font-bold">
                                        {ebook.category}
                                    </Text>
                                </View>

                                <Text className="text-yellow-900 font-bold text-lg mb-2 leading-6">
                                    {ebook.title}
                                </Text>

                                <View className="flex-row items-center mb-2">
                                    <FontAwesome5 name="user-circle" size={12} color="#854d0e" />
                                    <Text className="text-yellow-700 text-sm ml-2">
                                        {ebook.author}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-2">
                                    <FontAwesome5 name="calendar-alt" size={12} color="#854d0e" />
                                    <Text className="text-yellow-700 text-sm ml-2">
                                        {formatDate(ebook.publishedDate)}
                                    </Text>
                                </View>

                                <View className="flex-row items-center mb-2">
                                    <FontAwesome5 name="file-alt" size={12} color="#854d0e" />
                                    <Text className="text-yellow-700 text-sm ml-2">
                                        {ebook.pages} halaman
                                    </Text>
                                </View>

                                <View className="flex-row items-center">
                                    <FontAwesome5 name="hdd" size={12} color="#854d0e" />
                                    <Text className="text-yellow-700 text-sm ml-2">
                                        {ebook.fileSize}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Description */}
                        <View className="mt-4 pt-4 border-t border-yellow-200">
                            <Text className="text-yellow-900 text-sm leading-5">
                                {ebook.description}
                            </Text>
                        </View>
                    </View>

                    {/* QUICK ACTION - READ NOW */}
                    <View className="px-4 pt-4">
                        <TouchableOpacity
                            onPress={() => {
                                setViewMode('read');
                                setPdfLoading(true);
                            }}
                            className="bg-yellow-600 rounded-xl py-4 flex-row items-center justify-center shadow-lg border-2 border-yellow-500"
                            activeOpacity={0.8}
                        >
                            <FontAwesome5 name="book-open" size={18} color="#ffffff" />
                            <Text className="text-white text-lg font-bold ml-3">
                                Mulai Membaca Sekarang
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* CONTENT PREVIEW SECTION */}
                    <View className="px-4 py-6">
                        <Text className="text-yellow-900 font-bold text-base mb-3">Preview Konten</Text>
                        {loading ? (
                            <View className="items-center justify-center py-10">
                                <ActivityIndicator size="large" color="#ca8a04" />
                                <Text className="text-yellow-800 mt-4 font-semibold">Memuat konten...</Text>
                            </View>
                        ) : (
                            <View className="bg-white rounded-xl shadow-md border-2 border-yellow-300 p-4">
                                {renderContent()}
                            </View>
                        )}
                    </View>

                    {/* ACTION BUTTONS */}
                    <View className="px-4 pb-6">
                        {/* Download Button - Optional backup */}
                        {ebook.downloadUrl && (
                            <TouchableOpacity
                                onPress={handleDownload}
                                className="bg-amber-700 rounded-xl py-4 flex-row items-center justify-center shadow-md border-2 border-amber-600"
                                activeOpacity={0.8}
                            >
                                <FontAwesome5 name="download" size={16} color="#ffffff" />
                                <Text className="text-white text-base font-bold ml-3">
                                    Download untuk Offline
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default EbookDetailView;