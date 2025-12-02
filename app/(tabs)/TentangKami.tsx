import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface TentangKamiProps {
  setActiveSection: (section: string) => void;
}

const TentangKami = ({ setActiveSection }: TentangKamiProps) => {
  const handleContactPress = (type: string) => {
    switch(type) {
      case 'youtube':
        Linking.openURL('http://bit.ly/AggaJin_TV');
        break;
      case 'website':
        Linking.openURL('https://aggajinamitto.or.id');
        break;
      case 'phone':
        Linking.openURL('tel:+6281333693977');
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

      {/* Header - DIUBAH: tema gold */}
      <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-yellow-700">ℹ️ Tentang Kami</Text>
        </View>

        <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
          <FontAwesome5 name="dharmachakra" size={12} color="#854d0e" style={{ marginRight: 6 }} />
          <Text className="text-yellow-800 text-sm font-medium">Yayasan Agga Jina Mitto</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Yayasan Info - DIUBAH: header burgundy */}
        <View className="bg-white mx-4 my-4 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-red-900 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="dharmachakra" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Yayasan Agga Jina Mitto</Text>
            </View>
          </View>
          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-base leading-6 mb-4">
              Yayasan Agga Jina Mitto adalah badan hukum yang bergerak di bidang sosial, kemanusiaan, dan keagamaan Buddha. Yayasan ini didirikan oleh tiga bhikkhu pada 08 Agustus 2020 di Mojokerto, Jawa Timur:
            </Text>

            <View className="bg-white p-4 rounded-lg mb-4 border-2 border-yellow-200">
              <Text className="text-yellow-800 font-bold mb-3 text-sm">PENDIRI YAYASAN:</Text>
              <View className="space-y-2">
                <View className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3" />
                  <Text className="text-yellow-800 text-sm flex-1 font-medium">Y.M. Nyanasila, Thera.</Text>
                </View>
                <View className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3" />
                  <Text className="text-yellow-800 text-sm flex-1 font-medium">Y.M. Nyanavijjananda Pasadiko, Mahathera.</Text>
                </View>
                <View className="flex-row items-start">
                  <View className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3" />
                  <Text className="text-yellow-800 text-sm flex-1 font-medium">Y.M. Nyanakaruno, Mahathera.</Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome5 name="eye" size={14} color="#854d0e" style={{ marginRight: 8 }} />
                <Text className="text-yellow-800 font-bold text-base">Visi Yayasan</Text>
              </View>
              <Text className="text-yellow-900 text-sm leading-6 pl-6">
                Menjadi badan hukum yang memfasilitasi kegiatan dalam bidang sosial, kemanusiaan, dan keagamaan Buddha baik Sangha atau perumahtangga di Indonesia.
              </Text>
            </View>

            <View className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
              <View className="flex-row items-center">
                <FontAwesome5 name="certificate" size={12} color="#854d0e" style={{ marginRight: 8 }} />
                <Text className="text-yellow-800 text-xs font-bold flex-1">
                  SK Menteri Hukum dan HAM RI No: AHU-0013127.AH.01.04 Tahun 2020
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Misi Yayasan - DIUBAH: tema gold */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-yellow-600 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="tasks" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Misi Yayasan</Text>
            </View>
          </View>
          <View className="p-5 bg-amber-50">
            <View className="space-y-2">
              {[
                'Menaungi tempat ibadah agama Buddha yang belum memiliki badan hukum',
                'Menyediakan tempat tinggal yang tenang dan sesuai untuk bhikkhu dan bhikkhuni di Indonesia',
                'Mendirikan Panti Asuhan bagi anak-anak yang membutuhkan',
                'Mendirikan panti jompo bagi orang tua terlantar',
                'Mendirikan dan menaungi wihara sebagai tempat tinggal Sangha',
                'Mendirikan tempat untuk belajar dan berlatih Dharma',
                'Mendirikan tempat pendidikan dan pelatihan spiritual agama Buddha',
                'Menerbitkan kitab suci, buku agama Buddha dan khotbah ajaran Buddha',
                'Mendirikan dan merenovasi tempat ibadah agama Buddha',
                'Melestarikan lingkungan hidup'
              ].map((misi, index) => (
                <View key={index} className="flex-row items-start mb-2 bg-white p-3 rounded-lg border border-yellow-200">
                  <View className="bg-yellow-500 w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Text className="text-white text-xs font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-yellow-800 text-sm flex-1 font-medium" style={{ lineHeight: 20 }}>
                    {misi}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lembaga yang Dinaungi - DIUBAH: tema burgundy */}
        <View className="bg-white mx-4 mb-4 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-red-800 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="building" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Lembaga yang Dinaungi</Text>
            </View>
          </View>
          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-sm mb-4 leading-5 font-medium">
              Yayasan Agga Jina Mitto menaungi empat lembaga keagamaan Buddha:
            </Text>
            <View className="space-y-3">
              {[
                { 
                  title: 'Wihara Tantular Sugata Wilwatikta',
                  icon: 'home'
                },
                { 
                  title: 'Lembaga Pendidikan Pariyapunati Indonesia',
                  icon: 'graduation-cap'
                },
                { 
                  title: 'Padepokan Meditasi Buddhayana',
                  icon: 'spa'
                },
                { 
                  title: 'Padepokan Sumberejo',
                  icon: 'tree'
                }
              ].map((lembaga, index) => (
                <View key={index} className="bg-white p-4 rounded-lg border-2 border-yellow-300 mb-2">
                  <View className="flex-row items-start">
                    <View className="bg-yellow-100 p-2 rounded-full mr-3">
                      <FontAwesome5 name={lembaga.icon} size={14} color="#854d0e" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-yellow-900 font-bold text-sm mb-1 top-2">
                        {lembaga.title}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tentang Aplikasi - DIUBAH: tema burgundy soft */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-red-300">
          <View className="bg-red-900 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="mobile-alt" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Tentang Aplikasi</Text>
            </View>
          </View>

          <View className="p-5 bg-red-50">
            <View className="bg-white p-4 rounded-lg border-2 border-red-200 mb-3">
              <Text className="text-red-900 text-base leading-6 font-semibold mb-2">
                Buddhayana Digital
              </Text>
              <Text className="text-red-800 text-sm leading-6">
                Lahir dari kebutuhan akan akses yang mudah dan modern terhadap praktik spiritual Buddha di era digital.
              </Text>
            </View>
            
            <Text className="text-red-800 text-sm leading-6 mb-3">
              Aplikasi ini dikembangkan di bawah bimbingan Y.M. Nyanasila, Thera. sebagai bentuk dana kepada Sangha dan umat Buddha, dengan tujuan memfasilitasi praktik spiritual yang lebih mudah diakses oleh semua kalangan.
            </Text>
            
            <View className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
              <View className="flex-row items-start">
                <FontAwesome5 name="lightbulb" size={14} color="#7f1d1d" style={{ marginRight: 10, marginTop: 2 }} />
                <Text className="text-red-900 text-sm leading-6 flex-1 font-medium">
                  Dirancang untuk menjembatani tradisi kuno dengan teknologi modern, memungkinkan umat Buddha di mana pun untuk menjalankan praktik spiritual mereka dengan lebih konsisten.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Kontak - DIUBAH: tema gold dengan border */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-red-900 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="phone" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Hubungi Kami</Text>
            </View>
          </View>

          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-base mb-4 font-medium">
              Kami senang mendengar dari Anda! Hubungi kami untuk pertanyaan, saran, atau dukungan.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity 
                onPress={() => handleContactPress('youtube')}
                className="bg-white p-4 rounded-lg border-2 border-red-300 mb-3"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="bg-red-100 p-3 rounded-full mr-3">
                    <FontAwesome5 name="play-circle" size={18} color="#7f1d1d" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-900 font-bold mb-1">Youtube</Text>
                    <Text className="text-red-700 text-sm">AggaJin TV</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color="#7f1d1d" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleContactPress('website')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-300 mb-3"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="bg-yellow-100 p-3 rounded-full mr-3">
                    <FontAwesome5 name="globe" size={18} color="#854d0e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-yellow-900 font-bold mb-1">Website</Text>
                    <Text className="text-yellow-700 text-sm">www.aggajinamitto.or.id</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color="#854d0e" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleContactPress('phone')}
                className="bg-white p-4 rounded-lg border-2 border-yellow-300"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="bg-yellow-100 p-3 rounded-full mr-3">
                    <FontAwesome5 name="phone" size={18} color="#854d0e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-yellow-900 font-bold mb-1">Telepon</Text>
                    <Text className="text-yellow-700 text-sm">+62813 3369 3977</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={16} color="#854d0e" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Quote */}
        <View className="mx-4 mb-6 bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="items-center">
            <View className="bg-yellow-100 p-4 rounded-full mb-4">
              <FontAwesome5 name="spa" size={32} color="#854d0e" />
            </View>
            <Text className="text-2xl font-bold text-yellow-800 mb-3 text-center">
              Terima Kasih
            </Text>
            <Text className="text-yellow-800 text-center mb-4 leading-6 font-medium">
              Terima kasih telah mempercayai Aggajinamitto Digital sebagai pendamping perjalanan spiritual Anda. Aplikasi ini dipersembahkan sebagai dana untuk Sangha dan umat Buddha.
            </Text>
            <View className="bg-yellow-100 p-5 rounded-lg border-2 border-yellow-400 w-full">
              <Text className="text-yellow-900 italic text-center font-bold text-base mb-1">
                {"Sabbe sattā bhavantu sukhitattā"}
              </Text>
              <Text className="text-yellow-800 text-center text-sm font-medium">
                {"Semoga semua makhluk berbahagia"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TentangKami;