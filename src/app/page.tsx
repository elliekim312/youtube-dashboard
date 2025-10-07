'use client';

import { useState } from 'react';
import SearchBar, { SearchType } from '@/components/search/SearchBar';
import VideoTable from '@/components/search/SearchTable';
import { VideoData } from '@/types/search.types';
import { message } from '@/styles/common';

export default function Home() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (keyword: string, searchType: SearchType, minSubscribers: number, maxSubscribers: number, minViews: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/videos/search?keyword=${encodeURIComponent(keyword)}&searchType=${searchType}&minSubscribers=${minSubscribers}&maxSubscribers=${maxSubscribers}&minViews=${minViews}`
      );

      if (!response.ok) {
        throw new Error('Search failed.');
      }

      const data = await response.json();

      if (data.success) {
        setVideos(data.data);
      } else {
        throw new Error(data.error || 'Search failed.');
      }
    } catch (err) {
      console.error('Search Error:', err);
      setError(err instanceof Error ? err.message : 'Search failed.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 py-8 px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube Dashboard</h1>
        <p className="text-base text-gray-600">Search YouTube videos by keyword</p>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div style={message.error}>
            ⚠️ {error}
          </div>
        )}

        <VideoTable videos={videos} loading={loading} />
      </main>
    </div>
  );
}