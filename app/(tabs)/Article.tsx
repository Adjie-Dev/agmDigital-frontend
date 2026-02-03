import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ArticleDetailView from '../../components/ui/ArticleDetailView';
import blogspotService, { Article } from '../services/blogspotService';

const BuddhayanaArtikelPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    useEffect(() => {
        filterAndSortArticles();
    }, [articles, searchQuery, sortOrder]);

    useEffect(() => {
        if (viewMode === 'list') {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [currentPage, itemsPerPage, viewMode]);

    

    const loadArticles = async () => {
        setLoading(true);
        try {
            const data = await blogspotService.fetchArticles();
            setArticles(data);
        } catch (error) {
            Alert.alert('Error', 'Gagal memuat artikel. Periksa koneksi internet.');
            console.error('Load articles error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadArticles();
        } finally {
            setRefreshing(false);
        }
    };

    const filterAndSortArticles = () => {
        let filtered = [...articles];

        if (searchQuery) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredArticles(filtered);
        setCurrentPage(1);
    };

    const getPaginatedArticles = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredArticles.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const handleSelectArticle = (article: Article) => {
        setSelectedArticle(article);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedArticle(null);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const renderPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handlePageChange(i)}
                    className={`w-10 h-10 rounded-lg items-center justify-center mx-1 ${
                        currentPage === i 
                            ? 'bg-yellow-600' 
                            : 'bg-white border-2 border-yellow-300'
                    }`}
                >
                    <Text className={`font-bold ${
                        currentPage === i ? 'text-white' : 'text-yellow-800'
                    }`}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return pages;
    };

    if (viewMode === 'detail' && selectedArticle) {
        return (
            <SafeAreaView className="flex-1 bg-amber-50">
                <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />
                <ArticleDetailView 
                    key={selectedArticle.id}
                    article={selectedArticle} 
                    onBack={handleBackToList} 
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-yellow-700">
                        <FontAwesome5 name="book-open" size={20} color="#ca8a04" /> Artikel Dharma
                    </Text>
                    <View className="bg-yellow-200 px-3 py-1 rounded-full">
                        <Text className="text-yellow-800 text-xs font-bold">
                            {filteredArticles.length} ARTIKEL
                        </Text>
                    </View>
                </View>

                <View className="bg-yellow-50 rounded-xl border-2 border-yellow-300 flex-row items-center px-3 py-2">
                    <FontAwesome5 name="search" size={14} color="#854d0e" />
                    <TextInput
                        placeholder="Cari artikel..."
                        placeholderTextColor="#92400e"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-2 text-yellow-900"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <FontAwesome5 name="times-circle" size={16} color="#92400e" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="bg-white border-b-2 border-yellow-200 px-4 py-3">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Text className="text-yellow-800 font-semibold mr-2 text-sm">Urutan:</Text>
                        <TouchableOpacity
                            onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                            className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-1.5 flex-row items-center"
                        >
                            <FontAwesome5 
                                name={sortOrder === 'newest' ? 'sort-amount-down' : 'sort-amount-up'} 
                                size={12} 
                                color="#854d0e" 
                            />
                            <Text className="text-yellow-800 font-semibold ml-2 text-sm">
                                {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center">
                        <Text className="text-yellow-800 font-semibold mr-2 text-sm">Per halaman:</Text>
                        <View className="flex-row">
                            {[5, 10, 15].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    onPress={() => {
                                        setItemsPerPage(num);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg mx-0.5 ${
                                        itemsPerPage === num
                                            ? 'bg-yellow-600'
                                            : 'bg-yellow-100 border border-yellow-300'
                                    }`}
                                >
                                    <Text className={`font-bold text-sm ${
                                        itemsPerPage === num ? 'text-white' : 'text-yellow-800'
                                    }`}>
                                        {num}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            {/* SCROLLABLE CONTENT */}
            <ScrollView 
                ref={scrollViewRef}
                className="flex-1 px-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#ca8a04" />
                        <Text className="text-yellow-800 mt-4 font-semibold">Memuat artikel...</Text>
                    </View>
                ) : getPaginatedArticles().length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <FontAwesome5 name="book-open" size={48} color="#d97706" />
                        <Text className="text-yellow-800 mt-4 font-semibold text-lg">
                            Artikel tidak ditemukan
                        </Text>
                        <Text className="text-yellow-700 mt-2 text-center">
                            Coba gunakan kata kunci lain
                        </Text>
                    </View>
                ) : (
                    <View className="py-4">
                        {getPaginatedArticles().map((article) => (
                            <TouchableOpacity
                                key={article.id}
                                onPress={() => handleSelectArticle(article)}
                                className="bg-white rounded-xl shadow-md border-2 border-yellow-300 mb-4 overflow-hidden"
                                activeOpacity={0.7}
                            >
                                <View className="bg-yellow-600 px-4 py-2 flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <FontAwesome5 name="book-open" size={12} color="#ffffff" />
                                        <Text className="text-white text-sm ml-2 font-bold">
                                            Baca Selengkapnya
                                        </Text>
                                    </View>
                                    <FontAwesome5 name="chevron-right" size={14} color="#ffffff" />
                                </View>

                                {article.thumbnail && (
                                    <Image 
                                        source={{ uri: article.thumbnail }}
                                        style={{ width: '100%', height: 180 }}
                                        resizeMode="cover"
                                    />
                                )}

                                <View className="p-4">
                                    <Text className="text-yellow-900 font-bold text-lg mb-2 leading-6">
                                        {article.title}
                                    </Text>
                                    <Text className="text-yellow-800 text-sm leading-5 mb-3">
                                        {article.excerpt}
                                    </Text>

                                    <View className="flex-row items-center justify-between pt-3 border-t border-yellow-200">
                                        <View className="flex-row items-center">
                                            <FontAwesome5 name="user-circle" size={12} color="#854d0e" />
                                            <Text className="text-yellow-700 text-xs ml-1 font-medium">
                                                {article.author}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <FontAwesome5 name="calendar-alt" size={12} color="#854d0e" />
                                            <Text className="text-yellow-700 text-xs ml-1">
                                                {formatDate(article.date)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {!loading && getPaginatedArticles().length > 0 && (
                    <View className="bg-white rounded-xl shadow-md border-2 border-yellow-300 p-4 mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-yellow-800 font-semibold text-sm">
                                Halaman {currentPage} dari {totalPages}
                            </Text>
                            <Text className="text-yellow-700 text-xs">
                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-
                                {Math.min(currentPage * itemsPerPage, filteredArticles.length)} dari {filteredArticles.length}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-center">
                            <TouchableOpacity
                                onPress={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-lg items-center justify-center mx-1 ${
                                    currentPage === 1 ? 'bg-gray-200' : 'bg-white border-2 border-yellow-300'
                                }`}
                            >
                                <FontAwesome5 name="angle-double-left" size={16} color={currentPage === 1 ? '#9ca3af' : '#854d0e'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-lg items-center justify-center mx-1 ${
                                    currentPage === 1 ? 'bg-gray-200' : 'bg-white border-2 border-yellow-300'
                                }`}
                            >
                                <FontAwesome5 name="angle-left" size={16} color={currentPage === 1 ? '#9ca3af' : '#854d0e'} />
                            </TouchableOpacity>

                            {renderPaginationNumbers()}

                            <TouchableOpacity
                                onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-lg items-center justify-center mx-1 ${
                                    currentPage === totalPages ? 'bg-gray-200' : 'bg-white border-2 border-yellow-300'
                                }`}
                            >
                                <FontAwesome5 name="angle-right" size={16} color={currentPage === totalPages ? '#9ca3af' : '#854d0e'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-lg items-center justify-center mx-1 ${
                                    currentPage === totalPages ? 'bg-gray-200' : 'bg-white border-2 border-yellow-300'
                                }`}
                            >
                                <FontAwesome5 name="angle-double-right" size={16} color={currentPage === totalPages ? '#9ca3af' : '#854d0e'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BuddhayanaArtikelPage;