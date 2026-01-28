import React, { useState } from 'react';
import {
    Alert,
    Clipboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface DukungKamiProps {
  setActiveSection: (section: string) => void;
}

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
  icon: string;
  color: string;
}

const DukungKami = ({ setActiveSection }: DukungKamiProps) => {
  const [copiedAccount, setCopiedAccount] = useState<string>('');

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    setCopiedAccount(label);
    Alert.alert('Tersalin', `${label} telah disalin ke clipboard`);
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  const bankAccounts: { [key: string]: BankAccount[] } = {
    yayasan: [
      {
        bank: 'BCA',
        accountNumber: '050 9691 888',
        accountName: 'Yay. Agga Jina Mitto',
        icon: 'university',
        color: '#1e40af'
      }
    ],
    wihara: [
      {
        bank: 'BRI',
        accountNumber: '350301024816539',
        accountName: 'Wihara Buddhayana Mojokerto',
        icon: 'university',
        color: '#1e3a8a'
      },
      {
        bank: 'BCA',
        accountNumber: '0509698777',
        accountName: 'Yay. Agga Jina Mitto',
        icon: 'university',
        color: '#1e40af'
      }
    ],
    padepokan: [
      {
        bank: 'BCA',
        accountNumber: '050 9690 555',
        accountName: 'Yay. Agga Jina Mitto',
        icon: 'university',
        color: '#1e40af'
      }
    ]
  };

  const renderBankCard = (account: BankAccount, index: number) => (
    <View key={index} className="bg-white p-4 rounded-lg border-2 border-yellow-300 mb-3">
      <View className="flex-row items-center mb-3">
        <View className="bg-yellow-100 p-3 rounded-full mr-3">
          <FontAwesome5 name={account.icon} size={16} color="#854d0e" />
        </View>
        <Text className="text-yellow-900 font-bold text-lg">{account.bank}</Text>
      </View>

      <View className="bg-amber-50 p-3 rounded-lg mb-2">
        <Text className="text-yellow-700 text-xs font-medium mb-1">Nomor Rekening</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-yellow-900 font-bold text-lg">{account.accountNumber}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(account.accountNumber.replace(/\s/g, ''), `${account.bank} - ${account.accountNumber}`)}
            className="bg-yellow-200 p-2 rounded-lg"
            activeOpacity={0.7}
          >
            <FontAwesome5 name="copy" size={14} color="#854d0e" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-amber-50 p-3 rounded-lg">
        <Text className="text-yellow-700 text-xs font-medium mb-1">Atas Nama</Text>
        <Text className="text-yellow-900 font-semibold text-base">{account.accountName}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E7" />

      {/* Header */}
      <View className="bg-white shadow-md border-b-2 border-yellow-600 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-yellow-700">💝 Dukung Kami</Text>
        </View>

        <View className="flex-row items-center justify-center bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
          <FontAwesome5 name="heart" size={12} color="#854d0e" style={{ marginRight: 6 }} />
          <Text className="text-yellow-800 text-sm font-medium">Dana untuk Sangha & Dharma</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Intro Section */}
        <View className="mx-4 my-4 bg-white rounded-xl shadow-md border-2 border-red-300">
          <View className="bg-red-900 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="hands-helping" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Dukungan Anda Berarti</Text>
            </View>
          </View>

          <View className="p-5 bg-red-50">
            <Text className="text-red-900 text-base leading-6 mb-4 font-medium">
              Dukungan Anda sangat berharga untuk menjaga keberlangsungan vihara, kegiatan Dharma, dan kesejahteraan Sangha. Setiap dana yang diberikan adalah bentuk kebajikan yang membawa berkah bagi semua makhluk.
            </Text>

            <View className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
              <View className="flex-row items-start">
                <FontAwesome5 name="lightbulb" size={14} color="#7f1d1d" style={{ marginRight: 10, marginTop: 2 }} />
                <Text className="text-red-900 text-sm leading-6 flex-1 font-medium">
                  Dana Anda membantu perawatan vihara, kegiatan keagamaan, dan mendukung kehidupan spiritual Sangha yang mengabdi untuk menyebarkan Dharma.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Yayasan Agga Jina Mitto */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-yellow-600 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="dharmachakra" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Yayasan Agga Jina Mitto</Text>
            </View>
          </View>

          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-sm leading-6 mb-4 font-medium">
              Untuk Perawatan Vihara, Kegiatan Umum, dan Sanghadana
            </Text>
            {bankAccounts.yayasan.map((account, index) => renderBankCard(account, index))}
          </View>
        </View>

        {/* Wihara Buddhayana Mojokerto */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-red-800 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="vihara" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Wihara Buddhayana Mojokerto</Text>
            </View>
          </View>

          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-sm leading-6 mb-4 font-medium">
              Untuk kegiatan dan operasional Wihara Buddhayana Mojokerto
            </Text>
            {bankAccounts.wihara.map((account, index) => renderBankCard(account, index))}
          </View>
        </View>

        {/* Padepokan Meditasi Buddhayana */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-yellow-300">
          <View className="bg-yellow-700 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="tree" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Padepokan Meditasi Buddhayana</Text>
            </View>
          </View>

          <View className="p-5 bg-amber-50">
            <Text className="text-yellow-900 text-sm leading-6 mb-4 font-medium">
              Untuk pengembangan dan kegiatan meditasi di Padepokan
            </Text>
            {bankAccounts.padepokan.map((account, index) => renderBankCard(account, index))}
          </View>
        </View>

        {/* Important Notes */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-md border-2 border-red-300">
          <View className="bg-red-900 p-4 rounded-t-xl">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-2 rounded-full mr-3">
                <FontAwesome5 name="info-circle" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-lg">Catatan Penting</Text>
            </View>
          </View>

          <View className="p-5 bg-red-50">
            <View className="space-y-3">
              <View className="bg-white p-4 rounded-lg border-2 border-red-200 mb-3">
                <View className="flex-row items-start">
                  <View className="bg-red-100 p-2 rounded-full mr-3 mt-0.5">
                    <FontAwesome5 name="hand-holding-heart" size={14} color="#7f1d1d" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-900 font-bold text-sm mb-1">Ikhlas & Sukarela</Text>
                    <Text className="text-red-800 text-sm leading-5">
                      Semua dana bersifat sukarela dan diberikan dengan hati yang ikhlas sebagai bentuk kebajikan.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white p-4 rounded-lg border-2 border-red-200 mb-3">
                <View className="flex-row items-start">
                  <View className="bg-red-100 p-2 rounded-full mr-3 mt-0.5">
                    <FontAwesome5 name="shield-alt" size={14} color="#7f1d1d" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-900 font-bold text-sm mb-1">Transparansi</Text>
                    <Text className="text-red-800 text-sm leading-5">
                      Dana dikelola dengan penuh tanggung jawab dan digunakan sepenuhnya untuk kepentingan Dharma dan Sangha.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white p-4 rounded-lg border-2 border-red-200">
                <View className="flex-row items-start">
                  <View className="bg-red-100 p-2 rounded-full mr-3 mt-0.5">
                    <FontAwesome5 name="pray" size={14} color="#7f1d1d" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-900 font-bold text-sm mb-1">Kebajikan Bersama</Text>
                    <Text className="text-red-800 text-sm leading-5">
                      Setiap dukungan adalah investasi spiritual yang memberikan manfaat bagi banyak makhluk.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Blessing */}
        <View className="mx-4 mb-6 bg-white p-6 rounded-xl shadow-md border-2 border-yellow-300">
          <View className="items-center">
            <View className="bg-yellow-100 p-4 rounded-full mb-4">
              <FontAwesome5 name="heart" size={32} color="#854d0e" />
            </View>
            <Text className="text-2xl font-bold text-yellow-800 mb-3 text-center">
              Anumodana
            </Text>
            <Text className="text-yellow-800 text-center mb-4 leading-6 font-medium">
              Terima kasih atas kebaikan hati dan dukungan Anda. Semoga kebajikan ini membawa kebahagiaan dan kedamaian bagi Anda dan semua makhluk.
            </Text>
            <View className="bg-yellow-100 p-5 rounded-lg border-2 border-yellow-400 w-full">
              <Text className="text-yellow-900 italic text-center font-bold text-base mb-1">
                {"Puññaṃ katvā sukhaṃ labhati"}
              </Text>
              <Text className="text-yellow-800 text-center text-sm font-medium">
                {"Berbuat kebajikan membawa kebahagiaan"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DukungKami;