import EbookDetailView from '@/components/EbookDetailView';
import EbookListView, { Ebook } from '@/components/EbookListView';
import GoogleDriveService from '@/hooks/Googledriveservice';
import React from 'react';

const EbookPage = () => {
    // Function to load ebooks from Google Drive
    const loadGoogleDriveEbooks = async (): Promise<Ebook[]> => {
        try {
            const ebooksFromDrive = await GoogleDriveService.getAllEbooks();
            return ebooksFromDrive;
        } catch (error) {
            console.error('Error loading ebooks from Google Drive:', error);
            throw error;
        }
    };

    return (
        <EbookListView
            loadEbooksFunction={loadGoogleDriveEbooks}
            headerTitle="E-Book Dharma"
            headerIcon="book"
            statusBarColor="#FFF8E7"
            emptyStateMessage="Coba gunakan kata kunci lain atau pilih kategori berbeda"
            loadingMessage="Memuat ebook dari Google Drive..."
            EbookDetailComponent={EbookDetailView}
        />
    );
};

export default EbookPage;