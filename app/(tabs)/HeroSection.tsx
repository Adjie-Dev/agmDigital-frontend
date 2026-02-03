import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

interface HeroSectionProps {
  setActiveSection: (section: string) => void;
}


const HeroSection = ({ setActiveSection }: HeroSectionProps) => {
  const handleMulaiPuja = () => {
    const now = new Date()
    const currentHour = now.getHours()

    // Jam 00:00 sampai sebelum jam 12:00 siang = Puja Pagi
    // Jam 12:00 siang sampai jam 23:59 = Puja Sore
    if (currentHour >= 0 && currentHour <= 11) {
      setActiveSection('PujaPagi')
    } else {
      setActiveSection('PujaSore')
    }
  }

  const handleLihatPanduan = () => {
    setActiveSection('TentangKami')
  }

  return (
    <ImageBackground
        source={require('@/assets/images/buddha.png')}
        resizeMode="cover"
        style={{ flex: 1 }}
      >


      {/* Content */}
      <View className="relative px-6 py-24">
        <View className="items-center">
          <Text className="text-white text-4xl font-bold mb-6 text-center">
            Selamat Datang di{'\n'}Aggajinamitto Digital
          </Text>
          <Text className="text-white text-base opacity-95 text-center mb-8 leading-6 max-w-md">
            Platform edukasi Buddhist untuk memperdalam praktik spiritual Anda melalui puja, meditasi, dan pembelajaran Dharma
          </Text>
          <View className="flex-row flex-wrap justify-center gap-4">
            <TouchableOpacity
              className="bg-white px-8 py-3 rounded-xl shadow-lg"
              onPress={handleMulaiPuja}
              activeOpacity={0.8}
            >
              <Text className="text-yellow-800 font-bold text-center">Mulai Puja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-white px-8 py-3 rounded-xl bg-white/10"
              onPress={handleLihatPanduan}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center">Tentang Kami</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

export default HeroSection