import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import Navbar from '../../components/Navbar';
import Amithuocing from './Amithuocing';
import Article from './Article';
import Avamaggala from './Avamangala';
import Dashboard from './Dashboard';
import DhammaWacana from './DhammaWacana';
import DukungKami from './DukungKami';
import BuddhayanaEbookPage from './EbookPage';
import HeroSection from './HeroSection';
import BuddhistCalendar from './KalenderBuddhis';
import Meditasi from './Meditasi';
import PathamaPuja from './PathamaPuja';
import PujapagiScreen from './PujaPagi';
import Pujasore from './PujaSore';
import TentangKami from './TentangKami';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scroll to top whenever section changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [activeSection]);

  // Handle back button behavior
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeSection !== 'Dashboard') {
        setActiveSection('Dashboard');
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} />
            <Dashboard setActiveSection={setActiveSection} />
          </>
        );
      case 'PujaPagi':
        return <PujapagiScreen key="puja-pagi" />;
      case 'PujaSore':
        return <Pujasore key="puja-sore" />;
      case 'Meditasi':
        return <Meditasi key="meditasi" />;
      case 'Avamangala':
        return <Avamaggala key="avamangala" />
      case 'PathamaPuja':
        return <PathamaPuja key="pathama-puja" />
      case 'Amithuocing':
        return <Amithuocing key="amithuocing" />
      case 'Article':
        return <Article key="article" />
      case 'Ebook':
        return <BuddhayanaEbookPage key="ebook" />;
      case 'DhammaVacana':
        return <DhammaWacana key="dhamma-wacana" />;
      case 'CalendarBuddhist':
        return <BuddhistCalendar setActiveSection={setActiveSection} key="calendar-buddhist" />;
      case 'DukungKami':
        return <DukungKami setActiveSection={setActiveSection} key="dukung-kami" />;
      case 'TentangKami':
        return <TentangKami setActiveSection={setActiveSection} key="tentang-kami" />;
      default:
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} />
            <Dashboard setActiveSection={setActiveSection} />
          </>
        );
    }
  };

  // Halaman yang sudah punya ScrollView sendiri (SafeAreaView + ScrollView)
  const selfScrollingPages = [
    'PujaPagi', 
    'PujaSore', 
    'Meditasi',
    'Avamangala',
    'PathamaPuja',
    'Amithuocing',
    'Article',
    'DukungKami',
    'TentangKami'
  ];

  // Jika halaman sudah punya ScrollView sendiri, jangan wrap lagi
  if (selfScrollingPages.includes(activeSection)) {
    return (
      <View className="flex-1 bg-white">
        <Navbar
          activeSection={activeSection}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setActiveSection={setActiveSection}
        />
        {renderContent()}
      </View>
    );
  }

  // Untuk halaman lain (Dashboard, dll), bungkus dengan ScrollView
  return (
    <View className="flex-1 bg-white">
      <Navbar
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setActiveSection={setActiveSection}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default App;