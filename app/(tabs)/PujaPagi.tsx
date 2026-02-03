import PujaPageTemplate from '@/components/PujaPageTemplate';
import { PujaPagi } from '@/pujaData/PujaPagi';
import React from 'react';
import { Text } from 'react-native';

const VIDEO_URL = 'https://res.cloudinary.com/dp1bkwys1/video/upload/v1767786606/videos/paritta_myjmlj.mp4';
const VIDEO_FILENAME = 'puja_pagi_video.mp4';

const Pujapagi = () => {
  return (
    <PujaPageTemplate
      title="Puja Pagi"
      subtitle="Waktu Terbaik: 05:00 - 07:00 WIB"
      videoUrl={VIDEO_URL}
      videoFilename={VIDEO_FILENAME}
      videoTitle="Video Panduan Puja Pagi"
      sections={PujaPagi}
      preparationContent={
        <>
          <Text className="text-3xl font-bold text-yellow-600">Persiapan</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Duduk dengan posisi nyaman (bersila atau di kursi)</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Tenangkan pikiran beberapa detik</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Nyalakan lilin dandupa (opsional)</Text>
        </>
      }
      footerTitle="Selesaikan Puja Pagi"
      footerDescription="Setelah menyelesaikan semua bagian puja, dedikasikan merit untuk semua makhluk hidup."
      previewText="Namo tassa bhagavato arahato sammāsambuddhassa"
      textLabel="Teks Pali"
    />
  );
};

export default Pujapagi;