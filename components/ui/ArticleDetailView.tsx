import React, { useEffect, useRef } from 'react';
import { BackHandler, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Article } from '../../app/services/blogspotService';


interface ArticleDetailViewProps {
    article: Article;
    onBack: () => void;
}

const ArticleDetailView = ({ article, onBack }: ArticleDetailViewProps) => {
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const getProcessedContent = () => {
        if (!article.thumbnail) {
            return article.content;
        }
        return article.content.replace(/<img[^>]*>/, '');
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onBack();
            return true;
        });

        return () => backHandler.remove();
    }, [onBack]);

    // PAKSA SCROLL KE ATAS - MULTIPLE ATTEMPTS
    useEffect(() => {
        // Attempt 1: Immediate
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        
        // Attempt 2: After 1ms
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }, 1);
        
        // Attempt 3: After 50ms
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }, 50);
        
        // Attempt 4: After 100ms
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }, 100);
    }, [article.id]);

    // HANDLE CONTENT SIZE CHANGE - INI YANG PALING RELIABLE!
    const handleContentSizeChange = () => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    };

    return (
        <View className="flex-1 bg-white">
            <View className="bg-white shadow-sm px-4 py-3 border-b border-gray-100">
                <TouchableOpacity 
                    onPress={onBack} 
                    className="flex-row items-center"
                    activeOpacity={0.7}
                >
                    <FontAwesome5 name="arrow-left" size={20} color="#ca8a04" />
                    <Text className="text-base text-yellow-700 ml-3 font-semibold">
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                showsVerticalScrollIndicator={false}
                onContentSizeChange={handleContentSizeChange}
                removeClippedSubviews={false}
            >
                {article.thumbnail && (
                    <Image 
                        source={{ uri: article.thumbnail }}
                        style={{ width: '100%', height: 240 }}
                        resizeMode="cover"
                    />
                )}

                {/* Content Container */}
                <View className="px-4 pt-4 pb-6">
                    {/* Category Badge */}
                    <View className="flex-row items-center mb-3">
                        <View className="bg-yellow-100 px-3 py-1.5 rounded-full">
                            <Text className="text-yellow-700 text-xs font-semibold">
                                {article.category}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-gray-900 font-bold text-2xl mb-3 leading-tight">
                        {article.title}
                    </Text>

                    {/* Meta Information */}
                    <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
                        <View className="flex-row items-center mr-4">
                            <FontAwesome5 name="user-circle" size={14} color="#9ca3af" />
                            <Text className="text-gray-600 text-xs ml-1.5">
                                {article.author}
                            </Text>
                        </View>
                        <View className="flex-row items-center mr-4">
                            <FontAwesome5 name="calendar-alt" size={13} color="#9ca3af" />
                            <Text className="text-gray-600 text-xs ml-1.5">
                                {formatDate(article.date)}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <FontAwesome5 name="clock" size={13} color="#9ca3af" />
                            <Text className="text-gray-600 text-xs ml-1.5">
                                {article.readTime}
                            </Text>
                        </View>
                    </View>

                    {/* Article Content  */}
                    <RenderHTML
                        contentWidth={width - 32}
                        source={{ html: getProcessedContent() }}
                        tagsStyles={{
                            body: {
                                color: '#374151',
                                fontSize: 16,
                                lineHeight: 28,
                            },
                            p: {
                                marginBottom: 16,
                                textAlign: 'justify',
                                color: '#374151',
                                lineHeight: 28,
                            },
                            h1: {
                                color: '#1f2937',
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginTop: 24,
                                marginBottom: 12,
                            },
                            h2: {
                                color: '#1f2937',
                                fontSize: 22,
                                fontWeight: 'bold',
                                marginTop: 20,
                                marginBottom: 10,
                            },
                            h3: {
                                color: '#374151',
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 18,
                                marginBottom: 8,
                            },
                            img: {
                                borderRadius: 12,
                                marginVertical: 16,
                            },
                            a: {
                                color: '#ca8a04',
                                textDecorationLine: 'underline',
                                fontWeight: '600',
                            },
                            ul: {
                                marginLeft: 20,
                                marginBottom: 16,
                            },
                            ol: {
                                marginLeft: 20,
                                marginBottom: 16,
                            },
                            li: {
                                marginBottom: 8,
                                color: '#374151',
                                lineHeight: 24,
                            },
                            blockquote: {
                                borderLeftWidth: 4,
                                borderLeftColor: '#fbbf24',
                                backgroundColor: '#fef3c7',
                                paddingLeft: 16,
                                paddingVertical: 12,
                                marginVertical: 16,
                                fontStyle: 'italic',
                                color: '#78350f',
                                borderRadius: 8,
                            },
                            strong: {
                                color: '#1f2937',
                                fontWeight: 'bold',
                            },
                            em: {
                                color: '#4b5563',
                                fontStyle: 'italic',
                            },
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default ArticleDetailView;