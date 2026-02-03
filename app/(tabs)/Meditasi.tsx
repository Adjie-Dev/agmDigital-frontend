import VideoPageTemplate from '@/components/VideoPageTemplate';
import React from 'react';
import { Text } from 'react-native';

const VIDEO_URL = 'https://res.cloudinary.com/dp1bkwys1/video/upload/v1767786614/videos/meditasi_abujr1.mp4';
const VIDEO_FILENAME = 'tuntunan_meditasi.mp4';

const Meditasi = () => {
  return (
    <VideoPageTemplate
      title="Meditasi Satipathana"
      subtitle="Kapan Saja"
      videoUrl={VIDEO_URL}
      videoFilename={VIDEO_FILENAME}
      videoTitle="Video Panduan Meditasi Satipaṭṭhāna"
      icon="spa"
      preparationContent={
        <>
          <Text className="text-3xl font-bold text-yellow-600">Persiapan Meditasi</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Pilih tempat tenang dan bersih</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Duduk bersila atau di kursi dengan punggung tegak</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Kenakan pakaian longgar dan nyaman</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Hindari makan terlalu kenyang (1-2 jam setelah makan)</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Tetapkan niat untuk bermeditasi dengan tekun</Text>
          <Text className="text-yellow-700 text-sm font-semibold">• Ucapkan Namo Tassa 3x (opsional)</Text>
        </>
      }
      footerTitle="Mulai Praktik Meditasi Anda"
      footerDescription="Meditasi Satipaṭṭhāna adalah jalan menuju pembebasan yang diajarkan Buddha. Praktikkan dengan tekun dan penuh kesadaran. Semoga latihan ini membawa ketenangan, kebijaksanaan, dan kedamaian batin."
      footerQuote="Appamādena sampādetha"
      footerQuoteTranslation="Berusahalah dengan penuh kewaspadaan"
    />
  );
};

export default Meditasi;