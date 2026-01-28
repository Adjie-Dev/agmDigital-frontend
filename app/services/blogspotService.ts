export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  url: string;
  thumbnail?: string;
}

class BlogspotService {
  private blogUrl = 'https://buddhisme1981.blogspot.com';

  private stripHtml(html: string): string {
    let text = html;
    
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    
    text = text.replace(/<[^>]*>/g, ' ');
    
    text = text.replace(/&nbsp;/g, ' ')
               .replace(/&quot;/g, '"')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&#39;/g, "'")
               .replace(/&[a-z]+;/gi, ' ');
    
    text = text.replace(/[a-z-]+:\s*[^;]+;/gi, '');
    text = text.replace(/mso-[^:]+:[^;]+/gi, '');
    
    const metadataPatterns = [
      /\/\*.*?\*\//g,
      /Style\s+Definitions/gi,
      /table\s*\{[^}]*\}/gi,
      /\btable\b/gi,
      /\bNormal\b/gi,
      /\bfalse\b/gi,
      /\bX-NONE\b/gi,
      /\bEN-US\b/gi,
      /\bIN\b(?=\s|$)/gi,
      /\bAR-SA\b/gi,
      /\bZH-CN\b/gi,
      /\bJA\b(?=\s|$)/gi,
      /\bKO\b(?=\s|$)/gi,
      /\bX-\w+\b/gi,
      /\bMso\w*\b/gi,
      /\bmso\w*\b/gi,
      /\bfont-family:[^;]+;?/gi,
      /\bfont-size:[^;]+;?/gi,
      /\bmargin:[^;]+;?/gi,
      /\bpadding:[^;]+;?/gi
    ];
    
    metadataPatterns.forEach(pattern => {
      text = text.replace(pattern, '');
    });
    
    text = text.replace(/\b0\b(?!\d)/g, '');
    text = text.replace(/\{\}/g, '');
    text = text.replace(/\[\]/g, '');
    text = text.replace(/\r?\n|\r/g, ' ');
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\s+([.,!?;:])/g, '$1');
    
    text = text.trim();
    
    return text;
  }

  private getExcerpt(content: string, maxLength: number = 150): string {
    const text = this.stripHtml(content);
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length > 0) {
      let excerpt = sentences[0].trim();
      if (excerpt.length > maxLength) {
        excerpt = excerpt.substring(0, maxLength);
        excerpt = excerpt.substring(0, excerpt.lastIndexOf(' '));
      }
      return excerpt + '...';
    }
    
    return text.length > maxLength 
      ? text.substring(0, maxLength).trim() + '...' 
      : text;
  }

  private calculateReadTime(content: string): string {
    const text = this.stripHtml(content);
    const words = text.split(/\s+/).filter(word => word.length > 2).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} menit`;
  }

  private extractThumbnail(content: string): string | undefined {
    const imgRegex = /<img[^>]+src=["']([^"'>]+)["']/i;
    const match = content.match(imgRegex);
    return match ? match[1] : undefined;
  }

  async fetchArticles(): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.blogUrl}/feeds/posts/default?alt=json&max-results=100`
      );
      const data = await response.json();

      if (!data.feed || !data.feed.entry) {
        return [];
      }

      return data.feed.entry.map((entry: any) => {
        const content = entry.content?.$t || '';
        const category = entry.category?.[0]?.term || 'Dharma';
        
        return {
          id: entry.id.$t.split('-').pop() || '',
          title: entry.title.$t,
          excerpt: this.getExcerpt(content),
          content: content,
          author: entry.author?.[0]?.name.$t || 'Admin',
          date: entry.published.$t,
          category: category,
          readTime: this.calculateReadTime(content),
          url: entry.link.find((l: any) => l.rel === 'alternate')?.href || '#',
          thumbnail: this.extractThumbnail(content)
        };
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }
}

export default new BlogspotService();