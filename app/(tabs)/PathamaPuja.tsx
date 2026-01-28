import PujaPageTemplate from '@/components/PujaPageTemplate';
import { PathamaPuja } from '@/pujaData/PathamaPuja';
import React from 'react';
import { Text } from 'react-native';

const VIDEO_URL = 'https://res.cloudinary.com/dp1bkwys1/video/upload/v1767786627/videos/pujabakti_jhn04v.mp4';
const VIDEO_FILENAME = 'puja_bakti_video.mp4';

const PathamaPujaPage = () => {
  return (
    <PujaPageTemplate
      title="Pathama Puja"
      subtitle="Waktu Terbaik: Pagi dan Sore"
      videoUrl={VIDEO_URL}
      videoFilename={VIDEO_FILENAME}
      videoTitle="Video Panduan Pathama Puja"
      sections={PathamaPuja}
      preparationContent={
        <>
          <Text className="text-3xl font-bold text-yellow-600">Persiapan Puja Bakti</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Bersihkan altar & ruang puja.</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Siapkan patung/ gambar Buddha.</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Nyalakan lilin & dupa (opsional).</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Mandi/bersih-bersih.</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Kenakan pakaian rapi/sopan.</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Tenangkan pikiran beberapa menit sebelum mulai.</Text>
        </>
      }
      footerTitle="Selesaikan Paritta Avamangala"
      footerDescription="Avamangala Sutta adalah paritta pendek yang digunakan untuk menghalau nasib buruk, membersihkan batin, serta memunculkan perlindungan melalui kualitas Dhamma. Biasanya dibacakan setelah Namakkāra atau sebelum paritta lain."
      previewText="Namo tassa bhagavato arahato sammāsambuddhassa"
      textLabel="Teks Pali"
    />
  );
};

export default PathamaPujaPage;