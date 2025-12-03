import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const PathamaPuja = () => {
    return (
        <SafeAreaView className="flex-1 bg-amber-50">
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

            {/* Header */}
            <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-2xl font-bold text-yellow-700">📖 PathamaPuja</Text>
                </View>

                <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
                    <FontAwesome5 name="info-circle" size={12} color="#854d0e" style={{ marginRight: 6 }} />
                    <Text className="text-yellow-800 text-sm font-medium">Segera Hadir</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center items-center px-6 py-12">
                    {/* Icon Section */}
                    <View className="items-center mb-8">
                        <View className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full p-8 mb-6 border-4 border-yellow-400">
                            <FontAwesome5 name="dharmachakra" size={80} color="#854d0e" />
                        </View>
                        {/* Rotating Border Effect */}
                        <View className="absolute top-0">
                            <View className="w-40 h-40 border-4 border-yellow-300 border-dashed rounded-full opacity-30" />
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-3xl font-bold text-yellow-800 text-center mb-3">
                        This screen does not exist.
                    </Text>

                    <Text className="text-base text-yellow-700 text-center mb-8 leading-6 px-4">
                        Go to home screen!
                    </Text>

                    {/* Bottom Quote */}
                    <View className="bg-gradient-to-r from-yellow-100 to-red-50 rounded-xl border-2 border-yellow-300 p-6 w-full max-w-md">
                        <View className="items-center">
                            <FontAwesome5 name="leaf" size={28} color="#ca8a04" style={{ marginBottom: 12 }} />
                            <Text className="text-yellow-900 font-bold text-base text-center mb-2 italic">
                                Kesabaran adalah kunci menuju kebijaksanaan
                            </Text>
                            <View className="w-16 h-1 bg-yellow-400 rounded-full mt-2 mb-3" />
                            <Text className="text-yellow-800 text-center text-sm font-medium">
                                Sabbe satta bhavantu sukhitatta
                            </Text>
                            <Text className="text-yellow-700 text-center text-xs mt-1">
                                Semoga semua makhluk berbahagia
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PathamaPuja;