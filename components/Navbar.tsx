import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

type NavbarProps = {
    activeSection: string;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    setActiveSection: (section: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ 
    activeSection, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    setActiveSection
}) => {
    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    
    const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({});

    const navItems = [
        { id: 'Dashboard', label: 'Beranda', icon: 'home', color: 'yellow' },
        { 
            id: 'PaliWacana', 
            label: 'PĂLI VACANA', 
            icon: 'book', 
            color: 'yellow',
            isGroup: true,
            submenu: [
                { id: 'PathamaPuja', label: 'Pathama Puja', icon: 'book-open' },
                { id: 'PujaPagi', label: 'Puja Pagi', icon: 'sun' },
                { id: 'PujaSore', label: 'Puja Petang', icon: 'cloud-sun' },
                { id: 'Avamangala', label: 'Paritta Avamangala', icon: 'book' },
            ]
        },
        { 
            id: 'PujaMandarin', 
            label: 'SUTRA MANDARIN', 
            icon: 'book', 
            color: 'yellow',
            isGroup: true,
            submenu: [
                { id: 'Amithuocing', label: 'Amithuocing', icon: 'book-reader' }
            ]
        },
        { id: 'Meditasi', label: 'Meditasi Satipathana', icon: 'spa', color: 'red' },
        { id: 'Article', label: 'Artikel Dharma', icon: 'newspaper', color: 'red' },
        { 
            id: 'Ebook', 
            label: 'E-Book', 
            icon: 'book', 
            color: 'yellow',
            isGroup: true,
            submenu: [
                { id: 'Ebook', label: 'E-Book', icon: 'book', color: 'red' },
                { id: 'DhammaVacana', label: 'Dhamma Vacana', icon: 'book-reader', color: 'red' },
            ]
        },
        { id: 'CalendarBuddhist', label: 'Kalender Buddhis', icon: 'calendar-alt', color: 'yellow' },
        { id: 'DukungKami', label: 'Dukung Kami', icon: 'hand-holding-heart', color: 'red' },
    ];

    useEffect(() => {
        if (isMobileMenuOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SIDEBAR_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isMobileMenuOpen, slideAnim, opacityAnim]);

    const handleMenuItemPress = (sectionId: string, isGroup?: boolean) => {
        if (isGroup) {
            // Toggle expanded state untuk grup tertentu saja
            setExpandedGroups(prev => ({
                ...prev,
                [sectionId]: !prev[sectionId]
            }));
        } else {
            setActiveSection(sectionId);
            setIsMobileMenuOpen(false);
        }
    };

    const getItemColors = (itemId: string, color: string) => {
        const isActive = activeSection === itemId;
        
        if (color === 'yellow') {
            return {
                bg: isActive ? 'bg-yellow-50' : '',
                text: isActive ? 'text-yellow-700' : 'text-gray-700',
                icon: isActive ? '#854d0e' : '#6b7280',
                border: isActive ? 'border-yellow-300' : ''
            };
        } else if (color === 'red') {
            return {
                bg: isActive ? 'bg-red-50' : '',
                text: isActive ? 'text-red-800' : 'text-gray-700',
                icon: isActive ? '#7f1d1d' : '#6b7280',
                border: isActive ? 'border-red-300' : ''
            };
        } else {
            return {
                bg: isActive ? 'bg-orange-50' : '',
                text: isActive ? 'text-orange-700' : 'text-gray-700',
                icon: isActive ? '#c2410c' : '#6b7280',
                border: isActive ? 'border-orange-300' : ''
            };
        }
    };

    return (
        <>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            
            <View 
                className="bg-white shadow-lg relative z-10 border-b-2 border-yellow-400" 
                style={{ 
                    paddingTop: insets.top,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                }}
            >
                <View className="flex-row items-center justify-between px-4 py-3">
                    <Image
                        source={require('../assets/images/logowihara2.png')}
                        style={{ width: 73, height: 42, marginLeft: 8, top: 2 }}
                    />

                    <TouchableOpacity
                        onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-yellow-50"
                        activeOpacity={0.7}
                        style={{ minWidth: 40, minHeight: 40 }}
                    >
                        <FontAwesome5 
                            name={isMobileMenuOpen ? 'times' : 'bars'} 
                            size={24} 
                            color="#854d0e" 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={isMobileMenuOpen}
                onRequestClose={() => setIsMobileMenuOpen(false)}
                statusBarTranslucent={true}
            >
                <View className="flex-1">
                    <Animated.View 
                        className="flex-1 bg-black"
                        style={{ 
                            opacity: opacityAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.6]
                            })
                        }}
                    >
                        <TouchableOpacity
                            className="flex-1"
                            activeOpacity={1}
                            onPress={() => setIsMobileMenuOpen(false)}
                        />
                    </Animated.View>

                    <Animated.View
                        className="bg-amber-50 border-l-4 border-yellow-600 absolute right-0 top-0 bottom-0"
                        style={{
                            width: SIDEBAR_WIDTH,
                            transform: [{ translateX: slideAnim }],
                            paddingTop: 20
                        }}
                    >
                        <View className="px-4 py-6 border-b-2 border-yellow-400 bg-white">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1">
                                    <Image
                                        source={require('../assets/images/logowihara2.png')}
                                        style={{ width: 73, height: 42, marginLeft: 8, top: 2 }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => setIsMobileMenuOpen(false)}
                                    className="p-2 bg-yellow-100 rounded-full"
                                >
                                    <FontAwesome5 name="times" size={20} color="#b37712" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView className="flex-1 pt-4 px-2" showsVerticalScrollIndicator={false}>
                            {navItems.map((item) => {
                                const colors = getItemColors(item.id, item.color);
                                const isActive = activeSection === item.id;
                                // Cek apakah grup ini sedang expanded
                                const isExpanded = expandedGroups[item.id] || false;
                                
                                return (
                                    <View key={item.id}>
                                        <TouchableOpacity
                                            onPress={() => handleMenuItemPress(item.id, item.isGroup)}
                                            className={`flex-row items-center px-4 py-4 mx-2 rounded-xl mb-2 ${colors.bg} ${
                                                isActive ? `border-2 ${colors.border}` : 'border border-transparent'
                                            }`}
                                            activeOpacity={0.7}
                                            style={{
                                                backgroundColor: isActive ? undefined : '#ffffff'
                                            }}
                                        >
                                            <View className={`p-2 rounded-full ${
                                                isActive 
                                                    ? item.color === 'yellow' 
                                                        ? 'bg-yellow-200' 
                                                        : item.color === 'red'
                                                        ? 'bg-red-200'
                                                        : 'bg-orange-200'
                                                    : 'bg-gray-100'
                                            }`}>
                                                <FontAwesome5
                                                    name={item.icon}
                                                    size={20}
                                                    color={colors.icon}
                                                />
                                            </View>
                                            <Text 
                                                className={`ml-4 text-base font-semibold ${colors.text} flex-1`}
                                            >
                                                {item.label}
                                            </Text>
                                            
                                            {item.isGroup ? (
                                                <FontAwesome5
                                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                    size={16}
                                                    color={colors.icon}
                                                />
                                            ) : isActive && (
                                                <View className={`w-2 h-2 rounded-full ${
                                                    item.color === 'yellow' 
                                                        ? 'bg-yellow-600' 
                                                        : item.color === 'red'
                                                        ? 'bg-red-800'
                                                        : 'bg-orange-600'
                                                }`} />
                                            )}
                                        </TouchableOpacity>

                                        {item.isGroup && isExpanded && (
                                            <View className="ml-4 mr-2 mb-2">
                                                {item.submenu?.map((subitem) => {
                                                    const isSubActive = activeSection === subitem.id;
                                                    return (
                                                        <TouchableOpacity
                                                            key={subitem.id}
                                                            onPress={() => handleMenuItemPress(subitem.id)}
                                                            className={`flex-row items-center px-4 py-3 rounded-lg mb-1 ${
                                                                isSubActive 
                                                                    ? 'bg-yellow-100 border-l-4 border-yellow-500'
                                                                    : 'bg-white border-l-4 border-gray-200'
                                                            }`}
                                                            activeOpacity={0.7}
                                                        >
                                                            <FontAwesome5
                                                                name={subitem.icon}
                                                                size={16}
                                                                color={isSubActive ? '#854d0e' : '#9ca3af'}
                                                                style={{ marginRight: 12 }}
                                                            />
                                                            <Text 
                                                                className={`text-sm font-medium flex-1 ${
                                                                    isSubActive ? 'text-yellow-700' : 'text-gray-600'
                                                                }`}
                                                            >
                                                                {subitem.label}
                                                            </Text>
                                                            {isSubActive && (
                                                                <View className="w-2 h-2 rounded-full bg-yellow-600" />
                                                            )}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                            
                            <View style={{ height: 120 }} />
                        </ScrollView>

                    </Animated.View>
                </View>
            </Modal>
        </>
    );
};

export default Navbar;