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

  // Search channels by name
  async searchChannels(keyword: string, maxResults: number = 10): Promise<string[]> {
    try {
      const searchUrl = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(keyword)}&type=channel&maxResults=${maxResults}&key=${this.apiKey}`;

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`YouTube API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return [];
      }

      // Extract channel IDs
      return data.items.map((item: any) => item.id.channelId);
    } catch (error) {
      console.error('Channel Search Error:', error);
      throw error;
    }
  }

  // Search videos by channel IDs
  async searchVideosByChannels(channelIds: string[], maxResults: number = 20): Promise<VideoData[]> {
    try {
      const allVideos: VideoData[] = [];

      // Search videos for each channel
      for (const channelId of channelIds) {
        // Limit videos per channel to reduce API quota usage
        const perChannelLimit = Math.min(20, Math.ceil(maxResults / channelIds.length));
        const searchUrl = `${this.baseUrl}/search?part=snippet&channelId=${channelId}&type=video&maxResults=${perChannelLimit}&order=date&key=${this.apiKey}`;

        console.log(`Searching videos for channel ${channelId}, limit: ${perChannelLimit}`);
        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
          console.error(`Failed to search videos for channel ${channelId}: ${searchResponse.status}`);
          continue; // Skip this channel if error
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
          console.log(`No videos found for channel ${channelId}`);
          continue;
        }

        console.log(`Found ${searchData.items.length} videos for channel ${channelId}`);

        // Extract video IDs
        const videoIds = searchData.items
          .map((item: any) => item.id.videoId)
          .filter((id: string) => id) // Filter out undefined
          .join(',');

        if (!videoIds) continue;

        // Get video details
        const videosUrl = `${this.baseUrl}/videos?part=snippet,statistics&id=${videoIds}&key=${this.apiKey}`;

        const videosResponse = await fetch(videosUrl);

        if (!videosResponse.ok) {
          continue;
        }

        const videosData = await videosResponse.json();

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

        allVideos.push(...videos);
      }

      // Sort by view count and limit results
      return allVideos
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, maxResults);
    } catch (error) {
      console.error('Videos by Channel Error:', error);
      throw error;
    }
  }

  // Get channel statistics (subscriber count)
  async getChannelStats(channelIds: string[]): Promise<Map<string, number>> {
    try {
      const channelStatsMap = new Map<string, number>();

      // YouTube API allows up to 50 channel IDs per request
      const batchSize = 50;
      for (let i = 0; i < channelIds.length; i += batchSize) {
        const batch = channelIds.slice(i, i + batchSize);
        const channelsUrl = `${this.baseUrl}/channels?part=statistics&id=${batch.join(',')}&key=${this.apiKey}`;

        const response = await fetch(channelsUrl);

        if (!response.ok) {
          console.error(`Failed to fetch channel stats: ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (data.items) {
          data.items.forEach((item: any) => {
            const subscriberCount = parseInt(item.statistics?.subscriberCount || '0');
            channelStatsMap.set(item.id, subscriberCount);
          });
        }
      }

      return channelStatsMap;
    } catch (error) {
      console.error('Get Channel Stats Error:', error);
      return new Map();
    }
  }

  // Search videos by keyword
  async searchByKeyword(params: VideoSearchParams): Promise<VideoData[]> {
    try {
      const { keyword, maxResults = 20, searchType = 'keywords', minSubscribers, maxSubscribers, minViews } = params;

      let allVideos: VideoData[] = [];

      // If searchType is 'channel' or 'all', search for channels first
      if (searchType === 'channel' || searchType === 'all') {
        const channelIds = await this.searchChannels(keyword, 5);
        console.log(`Found ${channelIds.length} channels for keyword "${keyword}":`, channelIds);

        if (channelIds.length > 0) {
          const channelVideos = await this.searchVideosByChannels(channelIds, 50);
          console.log(`Found ${channelVideos.length} videos from channels`);
          allVideos.push(...channelVideos);
        }

        // If searchType is 'channel' only, apply filters and return
        if (searchType === 'channel') {
          let videos = allVideos;

          // Apply filters
          if (minViews !== undefined) {
            videos = videos.filter(video => video.viewCount >= minViews);
          }

          if (maxSubscribers !== undefined) {
            const uniqueChannelIds = Array.from(new Set(videos.map(v => v.channelId)));
            const channelStatsMap = await this.getChannelStats(uniqueChannelIds);
            videos = videos.filter(video => {
              const subscriberCount = channelStatsMap.get(video.channelId) || 0;
              return subscriberCount <= maxSubscribers;
            });
          }

          return videos.slice(0, maxResults);
        }
      }

      // For 'keywords' or 'all', use regular video search
      // Fetch more results to account for filtering, but limit to reduce API quota
      const fetchLimit = 30;
      const searchUrl = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=${fetchLimit}&order=viewCount&key=${this.apiKey}`;

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
        .filter((id: string) => id)
        .join(',');

      if (!videoIds) {
        return [];
      }

      // Get video details (views, likes, etc.)
      const videosUrl = `${this.baseUrl}/videos?part=snippet,statistics&id=${videoIds}&key=${this.apiKey}`;

      const videosResponse = await fetch(videosUrl);

      if (!videosResponse.ok) {
        throw new Error(`YouTube API Error: ${videosResponse.status}`);
      }

      const videosData = await videosResponse.json();

      // Format data
      const keywordVideos: VideoData[] = videosData.items.map((item: any) => ({
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

      // Combine with channel videos if searchType is 'all'
      if (searchType === 'all') {
        allVideos.push(...keywordVideos);
      } else {
        allVideos = keywordVideos;
      }

      // Remove duplicates by video ID
      const uniqueVideos = Array.from(
        new Map(allVideos.map(video => [video.id, video])).values()
      );

      let videos = uniqueVideos;

      console.log(`Total videos before filtering: ${videos.length}`);

      // Filter by minViews if specified
      if (minViews !== undefined) {
        const beforeFilter = videos.length;
        videos = videos.filter(video => video.viewCount >= minViews);
        console.log(`After minViews filter (>= ${minViews}): ${beforeFilter} -> ${videos.length}`);
      }

      // Filter by minSubscribers or maxSubscribers if specified
      if (minSubscribers !== undefined || maxSubscribers !== undefined) {
        // Get unique channel IDs
        const uniqueChannelIds = Array.from(new Set(videos.map(v => v.channelId)));

        // Fetch channel statistics
        const channelStatsMap = await this.getChannelStats(uniqueChannelIds);
        console.log('Channel subscriber counts:', Object.fromEntries(channelStatsMap));

        // Filter videos based on channel subscriber count
        const beforeFilter = videos.length;
        videos = videos.filter(video => {
          const subscriberCount = channelStatsMap.get(video.channelId) || 0;

          // Apply minSubscribers filter
          if (minSubscribers !== undefined && subscriberCount < minSubscribers) {
            return false;
          }

          // Apply maxSubscribers filter
          if (maxSubscribers !== undefined && subscriberCount > maxSubscribers) {
            return false;
          }

          return true;
        });
        console.log(`After subscribers filter (${minSubscribers || 0} <= subs <= ${maxSubscribers || 'unlimited'}): ${beforeFilter} -> ${videos.length}`);
      }

      console.log(`Final result count: ${videos.length}`);

      // Sort by view count and limit to maxResults after filtering
      return videos
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, maxResults);
    } catch (error) {
      console.error('YouTube Service Error:', error);
      throw error;
    }
  }
}

export const youtubeService = new YouTubeService();