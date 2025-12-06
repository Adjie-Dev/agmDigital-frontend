import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

const Dashboard = ({ setActiveSection }: DashboardProps) => {

  const features = [
    {
      title: 'Puja Pagi',
      description: 'Mulai hari dengan puja pagi yang membawa ketenangan dan berkah',
      time: '05:00 - 07:00 WIB',
      icon: 'sun',
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-300',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      section: 'PujaPagi'
    },
    {
      title: 'Puja Petang',
      description: 'Tutup hari dengan puja petang untuk refleksi dan syukur',
      time: '15:00 - 17:00 WIB',
      icon: 'cloud-sun',
      color: 'bg-orange-500',
      borderColor: 'border-orange-300',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-800',
      section: 'PujaSore'
    },
    {
      title: 'Meditasi Satipathana',
      description: 'Berbagai teknik meditasi dengan panduan audio dan video',
      time: 'Kapan Saja',
      icon: 'spa',
      color: 'bg-red-800',
      borderColor: 'border-red-300',
      bgLight: 'bg-red-50',
      textColor: 'text-red-900',
      section: 'Meditasi'
    },
  ];

  const article = [
    {
      title: 'Artikel Dharma Terbaru',
      description: 'Artikel Dharma yang menambah wawasan dan pengetahuan',
      time: 'Artikel Dharma Terbaru',
      icon: 'book',
      color: 'bg-amber-700',
      borderColor: 'border-red-300',
      bgLight: 'bg-amber-50',
      textColor: 'text-red-900',
      section: 'Article'
    }
  ]

  const handleNavigateToSection = (section: string) => {
    setActiveSection(section);
  };

  // const handleNavigateToWebsite = (url: string) => {
  //   Linking.openURL(url).catch(err => {
  //     console.error("Failed to open URL:", err);
  //     Alert.alert("Error", "Tidak dapat membuka link");
  //   });
  // };

  const images = {
    bhanteSila: require('../../assets/images/bhante-nyanasila-thera.jpg')
  };

  return (
    <ScrollView className="flex-1 bg-amber-50">
      {/* Hero Section */}
      <View style={{ backgroundColor: '#b45309' }} className="px-6 py-16">
        <View className="items-center">
          {/* foto bhante */}
          <Image source={images['bhanteSila']} style={{ width: 150, height: 150 }} className='rounded-full p-6 mb-6' />
          <Text className="text-4xl font-bold text-white text-center mb-3">
            Aggajinamitto Digital
          </Text>
          {/* <Text className="text-3xl font-bold text-white text-center mb-4">
            Aggajinamitto Digital
          </Text> */}
          <Text className="text-white text-center text-base leading-6 max-w-md">
            𝐏𝐥𝐚𝐭𝐟𝐨𝐦 𝐞𝐝𝐮𝐤𝐚𝐬𝐢 𝐁𝐮𝐝𝐝𝐡𝐢𝐬 𝐝𝐚𝐧 𝐩𝐫𝐚𝐤𝐭𝐢𝐤 𝐥𝐚𝐭𝐢𝐡𝐚𝐧 𝐃𝐡𝐚𝐫𝐦𝐚 𝐡𝐚𝐫𝐢𝐚𝐧 𝐮𝐧𝐭𝐮𝐤 𝐒𝐚𝐧𝐠𝐡𝐚 𝐝𝐚𝐧 𝐔𝐦𝐚𝐭 𝐁𝐮𝐝𝐝𝐡𝐚.
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-4 -mt-8">
        {/* Quote Card */}
        <View className="bg-white rounded-2xl shadow-lg border-2 border-yellow-300 p-6 mb-6">
          <View className="flex-row mb-3">
            <FontAwesome5 name="quote-left" size={20} color="#ca8a04" />
            <View className="flex-1 mx-3">
              <Text className="text-yellow-900 text-base italic text-center leading-6 font-medium">
              &quot;Kesehatan adalah berkah tertinggi, ketenangan adalah kekayaan tertinggi, kepercayaan adalah kerabat terbaik, dan Nibbāna adalah kebahagiaan tertinggi.&quot;
              </Text>
            </View>
            <FontAwesome5 name="quote-right" size={20} color="#ca8a04" />
          </View>
          <Text className="text-yellow-700 text-sm text-center font-semibold">
            — Dhammapada 203
          </Text>
        </View>

        {/* Features Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-yellow-800">Praktik Dharma</Text>
            <View className="bg-yellow-200 px-3 py-1 rounded-full">
              <Text className="text-yellow-800 text-xs font-bold">3 FITUR</Text>
            </View>
          </View>

          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavigateToSection(feature.section)}
              className={`bg-white rounded-xl shadow-md border-2 ${feature.borderColor} mb-4 overflow-hidden`}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View className={`${feature.color} p-4 flex-row items-center justify-between`}>
                <View className="flex-row items-center flex-1">
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} className="p-3 rounded-full mr-3">
                    <FontAwesome5 name={feature.icon} size={20} color="#ffffff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">{feature.title}</Text>
                    <View className="flex-row items-center mt-1">
                      <FontAwesome5 name="clock" size={10} color="#ffffff" style={{ opacity: 0.8 }} />
                      <Text className="text-white text-xs ml-1 opacity-90">{feature.time}</Text>
                    </View>
                  </View>
                </View>
                <FontAwesome5 name="chevron-right" size={18} color="#ffffff" />
              </View>

              {/* Content */}
              <View className={`${feature.bgLight} p-4`}>
                <Text className={`${feature.textColor} leading-5`}>
                  {feature.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Article Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-yellow-800">Artikel</Text>
            <View className="bg-yellow-200 px-3 py-1 rounded-full">
            </View>
          </View>

          {article.map((article, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavigateToSection(article.section)}
              className={`bg-white rounded-xl shadow-md border-2 ${article.borderColor} mb-4 overflow-hidden`}
              activeOpacity={0.7}
            >
              {/* Header */}
            <View className={`${article.color} p-4 flex-row items-center justify-between`}>
              <View className="flex-row items-center flex-1">
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} className="p-3 rounded-full mr-3">
                  <FontAwesome5 name={article.icon} size={20} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">{article.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <FontAwesome5 name="globe" size={10} color="#ffffff" style={{ opacity: 0.8 }} />
                    <Text className="text-white text-xs ml-1 opacity-90">{article.time}</Text>
                  </View>
                </View>
              </View>
              <FontAwesome5 name="chevron-right" size={18} color="#ffffff" />
          </View>

      {/* Content */}
      <View className={`${article.bgLight} p-4`}>
        <Text className={`${article.textColor} leading-5`}>
          {article.description}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

        {/* Info Cards */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-yellow-800 mb-4">Mengapa Praktik Harian?</Text>
          
          <View className="bg-white rounded-xl shadow-md border-2 border-yellow-200 p-5 mb-3">
            <View className="flex-row items-start">
              <View className="bg-yellow-100 p-3 rounded-full mr-4">
                <FontAwesome5 name="brain" size={20} color="#854d0e" />
              </View>
              <View className="flex-1">
                <Text className="text-yellow-900 font-bold text-base mb-1">
                  Ketenangan Pikiran
                </Text>
                <Text className="text-yellow-800 text-sm leading-5">
                  Praktik rutin membantu menenangkan pikiran dan mengurangi stress dalam kehidupan sehari-hari
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl shadow-md border-2 border-yellow-200 p-5 mb-3">
            <View className="flex-row items-start">
              <View className="bg-red-100 p-3 rounded-full mr-4">
                <FontAwesome5 name="heart" size={20} color="#7f1d1d" />
              </View>
              <View className="flex-1">
                <Text className="text-red-900 font-bold text-base mb-1">
                  Kebijaksanaan & Welas Asih
                </Text>
                <Text className="text-red-800 text-sm leading-5">
                  Mengembangkan kebijaksanaan dan kasih sayang terhadap semua makhluk hidup
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl shadow-md border-2 border-yellow-200 p-5 mb-3">
            <View className="flex-row items-start">
              <View className="bg-yellow-100 p-3 rounded-full mr-4">
                <FontAwesome5 name="lightbulb" size={20} color="#854d0e" />
              </View>
              <View className="flex-1">
                <Text className="text-yellow-900 font-bold text-base mb-1">
                  Pemahaman Dharma
                </Text>
                <Text className="text-yellow-800 text-sm leading-5">
                  Memperdalam pemahaman ajaran Buddha melalui praktik konsisten
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Blessing */}
        <View className="bg-gradient-to-r from-yellow-100 to-red-50 rounded-xl border-2 border-yellow-300 p-6 mb-8">
          <View className="items-center">
            <FontAwesome5 name="spa" size={32} color="#ca8a04" style={{ marginBottom: 12 }} />
            <Text className="text-yellow-900 font-bold text-lg text-center mb-2">
              Sabbe Satta Bhavantu Sukhitatta
            </Text>
            <Text className="text-yellow-800 text-center text-sm">
              Semoga semua makhluk berbahagia
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;