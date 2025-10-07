export type SearchType = 'channel' | 'keywords' | 'all';

export interface VideoSearchParams {
    keyword: string;
    maxResults?: number;
    searchType?: SearchType;
    minSubscribers?: number;
    maxSubscribers?: number;
    minViews?: number;
}

export interface VideoData {
    id: string;
    title: string;
    channelName: string;
    channelId: string;
    publishedAt: string;
    thumbnailUrl: string;
    videoUrl: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

export interface SearchResponse {
    success: boolean;
    data: VideoData[];
    count: number;
    error?: string;
}