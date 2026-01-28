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

export interface Ebook {
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
}

interface EbookListViewProps {
    loadEbooksFunction: () => Promise<Ebook[]>;
    headerTitle: string;
    headerIcon?: string;
    statusBarColor?: string;
    emptyStateMessage?: string;
    loadingMessage?: string;
    EbookDetailComponent: React.ComponentType<{
        ebook: Ebook;
        onBack: () => void;
    }>;
}

const EbookListView: React.FC<EbookListViewProps> = ({
    loadEbooksFunction,
    headerTitle,
    headerIcon = 'book',
    statusBarColor = '#FFF8E7',
    emptyStateMessage = 'Coba gunakan kata kunci lain atau pilih kategori berbeda',
    loadingMessage = 'Memuat ebook...',
    EbookDetailComponent,
}) => {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(9);
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    
    const scrollViewRef = useRef<ScrollView>(null);

    const getCategories = (): string[] => {
        const categorySet = new Set<string>(['Semua']);
        ebooks.forEach(ebook => {
            if (ebook.category) {
                categorySet.add(ebook.category);
            }
        });
        return Array.from(categorySet);
    };

    const categories = getCategories();

    useEffect(() => {
        loadEbooks();
    }, []);

    useEffect(() => {
        filterAndSortEbooks();
    }, [ebooks, searchQuery, sortOrder, selectedCategory]);

    useEffect(() => {
        if (viewMode === 'list') {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [currentPage, itemsPerPage, viewMode]);

    const loadEbooks = async () => {
        setLoading(true);
        try {
            const loadedEbooks = await loadEbooksFunction();
            setEbooks(loadedEbooks);
            
            if (loadedEbooks.length === 0) {
                Alert.alert(
                    'Tidak Ada Data', 
                    'Tidak ada e-book ditemukan. Silakan coba lagi nanti.'
                );
            }
        } catch (error) {
            Alert.alert(
                'Error', 
                'Gagal memuat ebook. Periksa koneksi internet Anda.'
            );
            console.error('Load ebooks error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadEbooks();
        } finally {
            setRefreshing(false);
        }
    };

    const filterAndSortEbooks = () => {
        let filtered = [...ebooks];

        if (selectedCategory !== 'Semua') {
            filtered = filtered.filter(ebook => ebook.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(ebook =>
                ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ebook.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            if (sortOrder === 'title') {
                return a.title.localeCompare(b.title);
            }
            const dateA = new Date(a.publishedDate).getTime();
            const dateB = new Date(b.publishedDate).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredEbooks(filtered);
        setCurrentPage(1);
    };

    const getPaginatedEbooks = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEbooks.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);

    const handleReadEbook = (ebook: Ebook) => {
        setSelectedEbook(ebook);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedEbook(null);
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

    if (viewMode === 'detail' && selectedEbook) {
        return (
            <SafeAreaView className="flex-1 bg-amber-50">
                <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
                <EbookDetailComponent 
                    ebook={selectedEbook} 
                    onBack={handleBackToList} 
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />

            {/* HEADER */}
            <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-yellow-700">
                        <FontAwesome5 name={headerIcon} size={20} color="#ca8a04" /> {headerTitle}
                    </Text>
                    <View className="bg-yellow-200 px-3 py-1 rounded-full">
                        <Text className="text-yellow-800 text-xs font-bold">
                            {filteredEbooks.length} EBOOK
                        </Text>
                    </View>
                </View>

                {/* SEARCH BAR */}
                <View className="bg-yellow-50 rounded-xl border-2 border-yellow-300 flex-row items-center px-3 py-2">
                    <FontAwesome5 name="search" size={14} color="#854d0e" />
                    <TextInput
                        placeholder="Cari ebook..."
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

            {/* CATEGORY FILTER */}
            {ebooks.length > 0 && (
                <View className="bg-white border-b-2 border-yellow-200">
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        className="px-4 py-3"
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                onPress={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full mr-2 ${
                                    selectedCategory === category
                                        ? 'bg-yellow-600'
                                        : 'bg-yellow-100 border border-yellow-300'
                                }`}
                            >
                                <Text className={`font-semibold text-sm ${
                                    selectedCategory === category ? 'text-white' : 'text-yellow-800'
                                }`}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* SORT AND ITEMS PER PAGE */}
            {ebooks.length > 0 && (
                <View className="bg-white border-b-2 border-yellow-200 px-4 py-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Text className="text-yellow-800 font-semibold mr-2 text-sm">Urutan:</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const nextSort = sortOrder === 'newest' ? 'oldest' : sortOrder === 'oldest' ? 'title' : 'newest';
                                    setSortOrder(nextSort);
                                }}
                                className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-1.5 flex-row items-center"
                            >
                                <FontAwesome5 
                                    name={sortOrder === 'title' ? 'sort-alpha-down' : sortOrder === 'newest' ? 'sort-amount-down' : 'sort-amount-up'} 
                                    size={12} 
                                    color="#854d0e" 
                                />
                                <Text className="text-yellow-800 font-semibold ml-2 text-sm">
                                    {sortOrder === 'title' ? 'Judul' : sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="text-yellow-800 font-semibold mr-2 text-sm">Per hal:</Text>
                            <View className="flex-row">
                                {[6, 9, 12].map((num) => (
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
            )}

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
                        <Text className="text-yellow-800 mt-4 font-semibold">{loadingMessage}</Text>
                    </View>
                ) : getPaginatedEbooks().length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <FontAwesome5 name="book" size={48} color="#d97706" />
                        <Text className="text-yellow-800 mt-4 font-semibold text-lg">
                            E-book tidak ditemukan
                        </Text>
                        <Text className="text-yellow-700 mt-2 text-center px-4">
                            {ebooks.length === 0 
                                ? 'Tidak ada ebook tersedia saat ini.'
                                : emptyStateMessage
                            }
                        </Text>
                    </View>
                ) : (
                    <View className="py-4">
                        {/* GRID LAYOUT - 2 COLUMNS */}
                        <View className="flex-row flex-wrap justify-between">
                            {getPaginatedEbooks().map((ebook) => (
                                <View
                                    key={ebook.id}
                                    className="bg-white rounded-xl shadow-md border-2 border-yellow-300 mb-4 overflow-hidden"
                                    style={{ width: '48%' }}
                                >
                                    {/* COVER IMAGE */}
                                    <View className="bg-yellow-50" style={{ width: '100%', height: 200 }}>
                                        <Image 
                                            source={{ uri: ebook.coverImage }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* CONTENT */}
                                    <View className="p-3 flex-1">
                                        {/* CATEGORY TAG */}
                                        <View className="bg-yellow-100 px-2 py-1 rounded-full self-start mb-2">
                                            <Text className="text-yellow-800 text-xs font-bold">
                                                {ebook.category}
                                            </Text>
                                        </View>

                                        {/* TITLE */}
                                        <View style={{ height: 40 }} className="mb-1">
                                            <Text className="text-yellow-900 font-bold text-sm leading-5" numberOfLines={2}>
                                                {ebook.title}
                                            </Text>
                                        </View>

                                        {/* AUTHOR */}
                                        <View className="flex-row items-center mb-2">
                                            <FontAwesome5 name="user-circle" size={10} color="#854d0e" />
                                            <Text className="text-yellow-700 text-xs ml-1 flex-1" numberOfLines={1}>
                                                {ebook.author}
                                            </Text>
                                        </View>

                                        {/* INFO */}
                                        <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-yellow-200">
                                            <View className="flex-row items-center">
                                                <FontAwesome5 name="file-alt" size={10} color="#854d0e" />
                                                <Text className="text-yellow-700 text-xs ml-1">
                                                    {ebook.pages} hal
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <FontAwesome5 name="hdd" size={10} color="#854d0e" />
                                                <Text className="text-yellow-700 text-xs ml-1">
                                                    {ebook.fileSize}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* READ BUTTON */}
                                        <TouchableOpacity
                                            onPress={() => handleReadEbook(ebook)}
                                            className="bg-yellow-600 rounded-lg py-2 flex-row items-center justify-center"
                                            activeOpacity={0.8}
                                        >
                                            <FontAwesome5 name="book-open" size={12} color="#ffffff" />
                                            <Text className="text-white text-xs font-bold ml-2">
                                                Baca E-Book
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* PAGINATION */}
                {!loading && getPaginatedEbooks().length > 0 && (
                    <View className="bg-white rounded-xl shadow-md border-2 border-yellow-300 p-4 mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-yellow-800 font-semibold text-sm">
                                Halaman {currentPage} dari {totalPages}
                            </Text>
                            <Text className="text-yellow-700 text-xs">
                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-
                                {Math.min(currentPage * itemsPerPage, filteredEbooks.length)} dari {filteredEbooks.length}
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

export default EbookListView;