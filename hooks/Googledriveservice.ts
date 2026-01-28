import axios from 'axios';

// GANTI DENGAN API KEY ANDA
const GOOGLE_API_KEY = 'AIzaSyBbJyw0f54QJHANpwBbbKvqO9PR3UkeCIc';
const FOLDER_ID = '1DrXPm8_ugh1gJj82roaVxTUVbAZ0gGnh';

interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    modifiedTime?: string;
    thumbnailLink?: string;
    webContentLink?: string;
    description?: string;
    fileExtension?: string;
}

interface Ebook {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    category: string;
    pages: number;
    fileSize: string;
    language: string;
    publishedDate: string;
    content?: string;
    downloadUrl?: string;
    driveFileId?: string;
}

class GoogleDriveService {
    /**
     * List all files in the Google Drive folder
     * NOTE: Folder harus di-set sebagai "Anyone with the link can view"
     */
    static async listFilesInFolder(): Promise<GoogleDriveFile[]> {
        try {
            const response = await axios.get(
                'https://www.googleapis.com/drive/v3/files',
                {
                    params: {
                        q: `'${FOLDER_ID}' in parents and trashed=false`,
                        key: GOOGLE_API_KEY,
                        fields: 'files(id, name, mimeType, size, modifiedTime, thumbnailLink, webContentLink, description, fileExtension)',
                        orderBy: 'modifiedTime desc',
                        pageSize: 100,
                    },
                }
            );

            return response.data.files || [];
        } catch (error) {
            console.error('Error listing files from Google Drive:', error);
            throw error;
        }
    }

    /**
     * Get file metadata
     */
    static async getFileMetadata(fileId: string): Promise<GoogleDriveFile | null> {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/drive/v3/files/${fileId}`,
                {
                    params: {
                        key: GOOGLE_API_KEY,
                        fields: 'id, name, mimeType, size, modifiedTime, thumbnailLink, webContentLink, description, fileExtension',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error getting file metadata:', error);
            return null;
        }
    }

    /**
     * Convert Google Drive file to Ebook format
     * Parsing metadata dari nama file dan description
     */
    static convertToEbook(file: GoogleDriveFile): Ebook {
        // Parse nama file untuk ekstrak informasi
        // Format expected: "Title - Author.pdf" atau "Title.pdf"
        const nameParts = file.name.replace(/\.(pdf|epub|txt)$/i, '').split(' - ');
        const title = nameParts[0].trim();
        const author = nameParts[1]?.trim() || 'Penulis Tidak Diketahui';

        // Parse description untuk category dan info lainnya
        // Format expected dalam description (optional):
        // Category: Sutra
        // Pages: 156
        // Language: Indonesia
        const description = file.description || 'Deskripsi tidak tersedia';
        const categoryMatch = description.match(/Category:\s*(.+)/i);
        const pagesMatch = description.match(/Pages:\s*(\d+)/i);
        const languageMatch = description.match(/Language:\s*(.+)/i);

        const category = categoryMatch ? categoryMatch[1].trim() : this.guessCategory(title);
        const pages = pagesMatch ? parseInt(pagesMatch[1]) : 100;
        const language = languageMatch ? languageMatch[1].trim() : 'Indonesia';

        // Format file size
        const fileSize = file.size ? this.formatFileSize(parseInt(file.size)) : 'Unknown';

        // Get thumbnail or use placeholder
        const coverImage = file.thumbnailLink 
            ? file.thumbnailLink.replace('=s220', '=s400') // Larger thumbnail
            : `https://via.placeholder.com/300x400/fbbf24/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`;

        // Format published date
        const publishedDate = file.modifiedTime 
            ? new Date(file.modifiedTime).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

        // Direct download URL
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

        return {
            id: file.id,
            title,
            author,
            description: this.extractDescription(description),
            coverImage,
            category,
            pages,
            fileSize,
            language,
            publishedDate,
            downloadUrl,
            driveFileId: file.id,
        };
    }

    /**
     * Format file size to readable format
     */
    private static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Guess category based on title keywords
     */
    private static guessCategory(title: string): string {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('dhamma') || titleLower.includes('sutra') || titleLower.includes('sutta')) {
            return 'Sutra';
        } else if (titleLower.includes('meditasi') || titleLower.includes('vipassana') || titleLower.includes('samatha')) {
            return 'Meditasi';
        } else if (titleLower.includes('jataka') || titleLower.includes('cerita') || titleLower.includes('kisah')) {
            return 'Cerita';
        } else if (titleLower.includes('abhidhamma') || titleLower.includes('filosofi') || titleLower.includes('filsafat')) {
            return 'Filosofi';
        } else if (titleLower.includes('metta') || titleLower.includes('praktik') || titleLower.includes('panduan')) {
            return 'Praktik';
        }
        
        return 'Umum';
    }

    /**
     * Extract clean description (remove metadata lines)
     */
    private static extractDescription(description: string): string {
        // Remove metadata lines like "Category: ...", "Pages: ...", etc.
        const cleanDescription = description
            .split('\n')
            .filter(line => !line.match(/^(Category|Pages|Language|Author):/i))
            .join('\n')
            .trim();
        
        return cleanDescription || 'Deskripsi tidak tersedia';
    }

    /**
     * Get all ebooks from the folder
     */
    static async getAllEbooks(): Promise<Ebook[]> {
        try {
            const files = await this.listFilesInFolder();
            
            // Filter hanya file PDF, EPUB, atau TXT
            const ebookFiles = files.filter(file => 
                file.mimeType === 'application/pdf' ||
                file.mimeType === 'application/epub+zip' ||
                file.mimeType === 'text/plain' ||
                file.name.match(/\.(pdf|epub|txt)$/i)
            );

            return ebookFiles.map(file => this.convertToEbook(file));
        } catch (error) {
            console.error('Error getting all ebooks:', error);
            throw error;
        }
    }

    /**
     * Download file content (untuk text files)
     */
    static async downloadTextContent(fileId: string): Promise<string | null> {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/drive/v3/files/${fileId}`,
                {
                    params: {
                        alt: 'media',
                        key: GOOGLE_API_KEY,
                    },
                    responseType: 'text',
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error downloading text content:', error);
            return null;
        }
    }

    /**
     * Get viewer URL for PDF
     */
    static getPdfViewerUrl(fileId: string): string {
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    /**
     * Get direct download URL
     */
    static getDownloadUrl(fileId: string): string {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
}

export default GoogleDriveService;
export type { Ebook, GoogleDriveFile };

