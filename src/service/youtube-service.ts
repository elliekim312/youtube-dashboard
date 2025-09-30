import { VideoData, VideoSearchParams } from '@/types/search.types';

class YouTubeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    this.baseUrl = process.env.YOUTUBE_API_BASE_URL || 'https://www.googleapis.com/youtube/v3';

    if (!this.apiKey) {
      console.error('YouTube API Key is not configured.');
    }
  }

  // Search videos by keyword
  async searchByKeyword(params: VideoSearchParams): Promise<VideoData[]> {
    try {
      const { keyword, maxResults = 20 } = params;

      // Step 1: Get video IDs from search API
      const searchUrl = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=${maxResults}&order=viewCount&key=${this.apiKey}`;
      
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error(`YouTube API Error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Extract video IDs
      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(',');

      // Step 2: Get video details (views, likes, etc.)
      const videosUrl = `${this.baseUrl}/videos?part=snippet,statistics&id=${videoIds}&key=${this.apiKey}`;
      
      const videosResponse = await fetch(videosUrl);
      
      if (!videosResponse.ok) {
        throw new Error(`YouTube API Error: ${videosResponse.status}`);
      }

      const videosData = await videosResponse.json();

      // Step 3: Format data
      const videos: VideoData[] = videosData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
      }));

      return videos;
    } catch (error) {
      console.error('YouTube Service Error:', error);
      throw error;
    }
  }
}

export const youtubeService = new YouTubeService();