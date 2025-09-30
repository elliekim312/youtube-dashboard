'use client';

import { useState } from 'react';
import SearchBar from '@/components/search/SearchBar';
import VideoTable from '@/components/search/SearchTable';
import { VideoData } from '@/types/search.types';
import { colors, spacing, fontSize, fontWeight } from '@/styles/tokens';
import { message } from '@/styles/common';

export default function Home() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (keyword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/videos/search?keyword=${encodeURIComponent(keyword)}`);
      
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>YouTube Dashboard</h1>
        <p style={styles.subtitle}>Search YouTube videos by keyword</p>
      </header>

      <main style={styles.main}>
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.gray100,
  },
  header: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    padding: spacing['2xl'],
    textAlign: 'center' as const,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing['2xl'],
  },
};