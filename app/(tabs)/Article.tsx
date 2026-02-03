import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    View
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WebView from 'react-native-webview';

const BuddhayanaArtikelPage = () => {
    const [fontSize, setFontSize] = useState<number>(16);

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

    // CSS untuk custom style website
    const injectedCSS = `
        body { 
            font-size: ${fontSize}px !important;
            line-height: ${fontSize * 1.6}px !important;
        }
        p, div, span, li {
            font-size: ${fontSize}px !important;
            line-height: ${fontSize * 1.6}px !important;
        }
        h1 { font-size: ${fontSize + 8}px !important; }
        h2 { font-size: ${fontSize + 6}px !important; }
        h3 { font-size: ${fontSize + 4}px !important; }
    `;

    const injectedJavaScript = `
        const style = document.createElement('style');
        style.innerHTML = \`${injectedCSS}\`;
        document.head.appendChild(style);
        true;
    `;

    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            {/* Header */}
            <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-yellow-700">
                        <FontAwesome5 name="dharmachakra" size={20} color="#ca8a04" /> Artikel Dharma
                    </Text>
                </View>

                <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
                    <FontAwesome5 name="book-open" size={12} color="#854d0e" style={{ marginRight: 6 }} />
                    <Text className="text-yellow-800 text-sm font-medium">Buddhayana.or.id</Text>
                </View>
            </View>

            {/* Font Size Control */}
            {/* <View className="mx-4 my-3 bg-white rounded-xl shadow-md border-2 border-yellow-300">
                <View className="bg-yellow-600 px-4 py-3 rounded-t-xl">
                    <View className="flex-row items-center">
                        <View className="bg-yellow-500 p-2 rounded-full mr-3">
                            <FontAwesome5 name="text-height" size={14} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">Pengaturan Tampilan</Text>
                        </View>
                        <View className="bg-yellow-200 px-2 py-1 rounded-full">
                            <Text className="text-yellow-800 text-xs font-medium">{getFontSizeLabel()}</Text>
                        </View>
                    </View>
                </View>

                <View className="p-3 bg-amber-50">
                    <View className="flex-row items-center justify-between bg-white p-2 rounded-lg border-2 border-yellow-300">
                        <TouchableOpacity
                            onPress={() => adjustFontSize(false)}
                            className={`flex-row items-center justify-center p-2 rounded-lg ${
                                fontSize <= 12 ? 'bg-gray-200' : 'bg-yellow-100'
                            }`}
                            disabled={fontSize <= 12}
                            style={{ flex: 1, marginRight: 8 }}
                        >
                            <FontAwesome5
                                name="minus"
                                size={14}
                                color={fontSize <= 12 ? '#9ca3af' : '#854d0e'}
                                style={{ marginRight: 4 }}
                            />
                            <Text className={`font-semibold text-sm ${fontSize <= 12 ? 'text-gray-400' : 'text-yellow-800'}`}>
                                Kecil
                            </Text>
                        </TouchableOpacity>

                        <View className="px-3">
                            <View className="flex-row items-center" style={{ gap: 3 }}>
                                {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                                    <View
                                        key={size}
                                        className={`w-1.5 h-1.5 rounded-full ${
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
                            className={`flex-row items-center justify-center p-2 rounded-lg ${
                                fontSize >= 24 ? 'bg-gray-200' : 'bg-yellow-100'
                            }`}
                            disabled={fontSize >= 24}
                            style={{ flex: 1, marginLeft: 8 }}
                        >
                            <FontAwesome5
                                name="plus"
                                size={14}
                                color={fontSize >= 24 ? '#9ca3af' : '#854d0e'}
                                style={{ marginRight: 4 }}
                            />
                            <Text className={`font-semibold text-sm ${fontSize >= 24 ? 'text-gray-400' : 'text-yellow-800'}`}>
                                Besar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View> */}

            {/* WebView dengan Custom Style */}
            <View className="flex-1 mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300 overflow-hidden">
                <WebView
                    source={{ uri: 'https://www.buddhayana.or.id/artikel/cat/dharma' }}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={(event) => {}}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View className="flex-1 items-center justify-center bg-amber-50">
                            <FontAwesome5 name="spinner" size={40} color="#ca8a04" />
                            <Text className="text-yellow-800 mt-4 font-semibold">Memuat artikel...</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default BuddhayanaArtikelPage;