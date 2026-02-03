import PujaPageTemplate from '@/components/PujaPageTemplate';
import { ParittaAvamanggala } from '@/pujaData/ParittaAvamangala';
import React from 'react';
import { Text } from 'react-native';

const VIDEO_URL = 'https://res.cloudinary.com/dp1bkwys1/video/upload/v1768064585/avamangala_sodg2d.mp4';
const VIDEO_FILENAME = 'paritta_avamangala_video.mp4';

const Avamangala = () => {
  return (
    <PujaPageTemplate
      title="Paritta Avamanggala"
      subtitle="Waktu Terbaik: Pagi dan Sore"
      videoUrl={VIDEO_URL}
      videoFilename={VIDEO_FILENAME}
      videoTitle="Video Panduan Paritta Avamangala"
      sections={ParittaAvamanggala}
      preparationContent={
        <>
          <Text className="text-3xl font-bold text-yellow-600">Waktu Ideal Membaca</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Saat akan memulai aktivitas penting</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Saat merasa batin tidak tenang atau banyak gangguan</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Saat puja pagi/malam</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Sebelum bepergian</Text>
        </>
      }
      footerTitle="Selesaikan Paritta Avamangala"
      footerDescription="Avamangala Sutta adalah paritta pendek yang digunakan untuk menghalau nasib buruk, membersihkan batin, serta memunculkan perlindungan melalui kualitas Dhamma. Biasanya dibacakan setelah Namakkāra atau sebelum paritta lain."
      previewText="Namo tassa bhagavato arahato sammāsambuddhassa"
      textLabel="Teks Pali"
    />
  );
};

export default Avamangala;