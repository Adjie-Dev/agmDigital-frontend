import PujaPageTemplate from '@/components/PujaPageTemplate';
import { Amithuocing } from '@/pujaData/Amithuocing';
import React from 'react';
import { Text } from 'react-native';

const VIDEO_URL = 'https://res.cloudinary.com/dp1bkwys1/video/upload/v1767786614/videos/fo_Shuo_A_Mi_Tuo_Jing_flkk3v.mp4';
const VIDEO_FILENAME = 'amithuocing_video.mp4';

const AmithuocingPage = () => {
  return (
    <PujaPageTemplate
      title="Amitabha Sutra"
      subtitle="Waktu Terbaik: Pagi dan Sore"
      videoUrl={VIDEO_URL}
      videoFilename={VIDEO_FILENAME}
      videoTitle="Video Panduan Amitabha Sutra"
      sections={Amithuocing}
      preparationContent={
        <>
          <Text className="text-3xl font-bold text-yellow-600">Persiapan</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Duduk dengan posisi nyaman (bersila atau di kursi)</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Tenangkan pikiran beberapa detik</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Nyalakan lilin dandupa (opsional)</Text>
        </>
      }
      footerTitle="Selesaikan Amitabha Sutra"
      footerDescription="Setelah menyelesaikan semua bagian sutra, dedikasikan merit untuk semua makhluk hidup."
      previewText="Fó Shuō A Mi Tuó JĪng"
      textLabel="Teks Mandarin"
    />
  );
};

export default AmithuocingPage;