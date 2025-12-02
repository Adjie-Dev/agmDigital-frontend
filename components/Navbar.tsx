import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Modal, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

    const navItems = [
        { id: 'Dashboard', label: 'Beranda', icon: 'home', color: 'yellow' },
        { id: 'PujaPagi', label: 'Puja Pagi', icon: 'white-balance-sunny', color: 'yellow' },
        { id: 'PujaSore', label: 'Puja Sore', icon: 'moon-waning-crescent', color: 'orange' },
        { id: 'Meditasi', label: 'Meditasi', icon: 'meditation', color: 'red' },
        { id: 'Avamangala', label: 'Paritta Avamangala', icon: 'bookmark', color: 'yellow' },
        { id: 'TentangKami', label: 'Tentang Kami', icon: 'information', color: 'yellow' },
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

    const handleMenuItemPress = (sectionId: string) => {
        setActiveSection(sectionId);
        setIsMobileMenuOpen(false);
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
        } else { // orange
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
            {/* Status Bar Configuration */}
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            
            {/* Header */}
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
                    {/* Logo */}
                    <Image
                        source={require('../assets/images/logowihara.png')}
                        style={{ width: 73, height: 42, marginLeft: 8, top: 2 }}
                    />

                    {/* Hamburger Menu Button */}
                    <TouchableOpacity
                        onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-yellow-50"
                        activeOpacity={0.7}
                        style={{ minWidth: 40, minHeight: 40 }}
                    >
                        <MaterialCommunityIcons 
                            name={isMobileMenuOpen ? 'close' : 'menu'} 
                            size={24} 
                            color="#854d0e" 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sidebar Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={isMobileMenuOpen}
                onRequestClose={() => setIsMobileMenuOpen(false)}
                statusBarTranslucent={true}
            >
                <View className="flex-1">
                    {/* Overlay - DIUBAH: opacity lebih gelap */}
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

                    {/* Sidebar */}
                    <Animated.View
                        className="bg-amber-50 border-l-4 border-yellow-600 absolute right-0 top-0 bottom-0"
                        style={{
                            width: SIDEBAR_WIDTH,
                            transform: [{ translateX: slideAnim }],
                            paddingTop: 20
                        }}
                    >
                        {/* Sidebar Header */}
                        <View className="px-4 py-6 border-b-2 border-yellow-400 bg-white">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1">
                                    <Image
                                        source={require('../assets/images/logowihara.png')}
                                        style={{ width: 73, height: 42, marginLeft: 8, top: 2 }}
                                    />
                                </View>
                                <TouchableOpacity 
                                    onPress={() => setIsMobileMenuOpen(false)}
                                    className="p-2 bg-yellow-100 rounded-full"
                                >
                                    <MaterialCommunityIcons name="close" size={20} color="#854d0e" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Navigation Items */}
                        <View className="pt-4 px-2">
                            {navItems.map((item) => {
                                const colors = getItemColors(item.id, item.color);
                                const isActive = activeSection === item.id;
                                
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleMenuItemPress(item.id)}
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
                                            <MaterialCommunityIcons
                                                name={item.icon}
                                                size={20}
                                                color={colors.icon}
                                            />
                                        </View>
                                        <Text 
                                            className={`ml-4 text-base font-semibold ${colors.text}`}
                                        >
                                            {item.label}
                                        </Text>
                                        {isActive && (
                                            <View className="ml-auto">
                                                <View className={`w-2 h-2 rounded-full ${
                                                    item.color === 'yellow' 
                                                        ? 'bg-yellow-600' 
                                                        : item.color === 'red'
                                                        ? 'bg-red-800'
                                                        : 'bg-orange-600'
                                                }`} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Info section */}
                        <View className="absolute bottom-8 left-0 right-0 px-4">
                            <View className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
                                <View className="flex-row items-center justify-center mb-2">
                                    <Text className="text-yellow-800 font-bold text-sm ml-2">
                                        Menu Navigasi
                                    </Text>
                                </View>
                                <Text className="text-yellow-700 text-xs text-center leading-4">
                                    Pilih menu untuk berpindah halaman
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
};

export default Navbar;