import { getRandomQuote } from '@/pujaData/Dhammapadaquotes';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

const Dashboard = ({ setActiveSection }: DashboardProps) => {
  const [quote, setQuote] = useState(getRandomQuote());
  const opacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withSequence(
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      );
      
      setTimeout(() => {
        setQuote(getRandomQuote());
      }, 2000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const images = {
    logo: require('../../assets/images/agm.png')
  };

  return (
    <View className="flex-1 bg-neutral-100">
      <View className="bg-[#2d2d2d] pt-16 pb-12 px-6 items-center">
        <Image source={images.logo} className="w-[150px] h-[150px] mb-1" />
        <Text className="text-sm text-neutral-200 text-center leading-6 max-w-xs">
          Platform edukasi Buddhis dan praktik latihan Dharma harian untuk Sangha dan Umat Buddha
        </Text>
      </View>

      <View className="p-5">
        <Text className="text-2xl font-extrabold text-neutral-800 mb-4 mt-2">
          Praktik Harian
        </Text>

        <View className="flex-row justify-between mb-7">
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 border border-neutral-300"
            onPress={() => setActiveSection('PujaPagi')}
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
              <FontAwesome5 name="sun" size={28} color="#b37712" />
            </View>
            <Text className="text-sm font-bold text-neutral-800 mb-1 text-center">
              Puja Pagi
            </Text>
            <Text className="text-xs text-neutral-600 text-center">
              05:00 - 07:00
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 border border-neutral-300"
            onPress={() => setActiveSection('PujaSore')}
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
              <FontAwesome5 name="cloud-sun" size={28} color="#b37712" />
            </View>
            <Text className="text-sm font-bold text-neutral-800 mb-1 text-center">
              Puja Petang
            </Text>
            <Text className="text-xs text-neutral-600 text-center">
              15:00 - 17:00
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 border border-neutral-300"
            onPress={() => setActiveSection('Meditasi')}
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-3">
              <FontAwesome5 name="spa" size={28} color="#b37712" />
            </View>
            <Text className="text-sm font-bold text-neutral-800 mb-1 text-center">
              Meditasi
            </Text>
            <Text className="text-xs text-neutral-600 text-center">
              Kapan Saja
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-6 mb-7 border-l-4 border-[#b37712]">
          <View className="mb-3">
            <FontAwesome5 name="quote-left" size={20} color="#b37712" />
          </View>
          <Animated.View style={animatedStyle}>
            <Text className="text-sm italic text-neutral-700 leading-6 mb-3">
              {quote.text}
            </Text>
            <Text className="text-xs text-neutral-600 font-semibold">
              {quote.verse}
            </Text>
          </Animated.View>
        </View>

        <TouchableOpacity
          className="bg-white rounded-2xl p-5 flex-row items-center mb-7 border border-neutral-300"
          onPress={() => setActiveSection('Article')}
          activeOpacity={0.8}
        >
          <View className="w-14 h-14 rounded-xl bg-amber-100 items-center justify-center mr-4">
            <FontAwesome5 name="newspaper" size={24} color="#b37712" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-neutral-800 mb-1">
              Artikel Dharma
            </Text>
            <Text className="text-sm text-neutral-600">
              Pelajari ajaran Buddha lebih dalam
            </Text>
          </View>
          <FontAwesome5 name="arrow-right" size={18} color="#a3a3a3" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-5 flex-row items-center mb-7 border border-neutral-300"
          onPress={() => setActiveSection('Ebook')}
          activeOpacity={0.8}
        >
          <View className="w-14 h-14 rounded-xl bg-amber-100 items-center justify-center mr-4">
            <FontAwesome5 name="book" size={24} color="#b37712" />
          </View>
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-neutral-800 mb-1">
              E-Book
            </Text>
            <Text className="text-sm text-neutral-600" numberOfLines={2}>
              Materi pembelajaran Dharma dalam format buku digital
            </Text>
          </View>
          <FontAwesome5 name="arrow-right" size={18} color="#a3a3a3" />
        </TouchableOpacity>

        <Text className="text-2xl font-extrabold text-neutral-800 mb-4 mt-2">
          Manfaat Praktik
        </Text>

        <View className="flex-row items-center mb-5">
          <View className="w-12 h-12 rounded-xl bg-amber-100 items-center justify-center mr-3">
            <FontAwesome5 name="brain" size={20} color="#b37712" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-neutral-800 mb-1">
              Ketenangan Pikiran
            </Text>
            <Text className="text-sm text-neutral-600 leading-5">
              Mengurangi stress dan kecemasan
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-5">
          <View className="w-12 h-12 rounded-xl bg-amber-100 items-center justify-center mr-3">
            <FontAwesome5 name="heart" size={20} color="#b37712" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-neutral-800 mb-1">
              Welas Asih
            </Text>
            <Text className="text-sm text-neutral-600 leading-5">
              Kasih sayang kepada semua makhluk
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-5">
          <View className="w-12 h-12 rounded-xl bg-amber-100 items-center justify-center mr-3">
            <FontAwesome5 name="lightbulb" size={20} color="#b37712" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-neutral-800 mb-1">
              Kebijaksanaan
            </Text>
            <Text className="text-sm text-neutral-600 leading-5">
              Pemahaman mendalam ajaran Buddha
            </Text>
          </View>
        </View>

        <View className="bg-neutral-50 rounded-2xl p-7 items-center mt-3 mb-5 border border-neutral-200">
          <FontAwesome5 name="spa" size={32} color="#b37712" />
          <Text className="text-lg font-bold text-neutral-800 mt-3 mb-1 text-center">
            Sabbe Satta Bhavantu Sukhitatta
          </Text>
          <Text className="text-sm text-neutral-600 text-center">
            Semoga semua makhluk berbahagia
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;