import EbookDetailView from '@/components/EbookDetailView';
import EbookListView, { Ebook } from '@/components/EbookListView';
import React from 'react';

const DhammaWacana = () => {
    // Dummy data untuk preview - nanti akan diganti dengan API call
    const dummyEbooks: Ebook[] = [
        {
            id: '1',
            title: 'Ārādhanā Atthasīla',
            author: 'Buddha Gotama',
            description: 'Kumpulan syair ajaran Buddha yang berisi kebijaksanaan tentang kehidupan, moral, dan pencerahan.',
            coverImage: 'https://via.placeholder.com/300x400/fbbf24/ffffff?text=Dhammapada',
            category: 'Sutra',
            pages: 156,
            fileSize: '2.5 MB',
            language: 'Indonesia',
            publishedDate: '2024-01-15',
        },
        {
            id: '2',
            title: 'Ārādhanā Pañcasīla',
            author: 'Bhikkhu Bodhi',
            description: 'Panduan lengkap praktik meditasi vipassana untuk mencapai ketenangan pikiran dan kebijaksanaan.',
            coverImage: 'https://via.placeholder.com/300x400/f59e0b/ffffff?text=Vipassana',
            category: 'Meditasi',
            pages: 98,
            fileSize: '1.8 MB',
            language: 'Indonesia',
            publishedDate: '2024-02-20',
        },
        {
            id: '3',
            title: 'Ārādhanā Dhammadesana',
            author: 'Bhikkhu Sariputta',
            description: 'Cerita-cerita inspiratif tentang kehidupan masa lalu Buddha yang mengajarkan nilai-nilai moral.',
            coverImage: 'https://via.placeholder.com/300x400/eab308/ffffff?text=Jataka',
            category: 'Cerita',
            pages: 234,
            fileSize: '3.2 MB',
            language: 'Indonesia',
            publishedDate: '2023-11-10',
        },
        {
            id: '4',
            title: 'Ārādhanā Paritta',
            author: 'Ven. Nyanatiloka',
            description: 'Penjelasan mendalam tentang Abhidhamma dan filsafat Buddhis yang kompleks.',
            coverImage: 'https://via.placeholder.com/300x400/d97706/ffffff?text=Abhidhamma',
            category: 'Filosofi',
            pages: 312,
            fileSize: '4.1 MB',
            language: 'Indonesia',
            publishedDate: '2023-09-05',
        },
    ];

    // Function to load ebooks - currently returns dummy data
    // Nanti bisa diganti dengan actual API call
    const loadDhammaWacanaEbooks = async (): Promise<Ebook[]> => {
        // Simulasi loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        return dummyEbooks;
    };

    return (
        <EbookListView
            loadEbooksFunction={loadDhammaWacanaEbooks}
            headerTitle="Dhamma Wacana"
            headerIcon="dharmachakra"
            statusBarColor="#FFF8E7"
            emptyStateMessage="Coba gunakan kata kunci lain atau pilih kategori berbeda"
            loadingMessage="Memuat Dhamma Wacana..."
            EbookDetailComponent={EbookDetailView}
        />
    );
};

export default DhammaWacana;