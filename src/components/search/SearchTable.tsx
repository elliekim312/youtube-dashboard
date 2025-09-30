'use client';

import { VideoData } from '@/types/search.types';
import { colors, spacing, borderRadius } from '@/styles/tokens';
import { card, table, message } from '@/styles/common';

interface VideoTableProps {
  videos: VideoData[];
  loading?: boolean;
}

export default function VideoTable({ videos, loading }: VideoTableProps) {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={message.base}>Loading data...</div>;
  }

  if (videos.length === 0) {
    return <div style={message.base}>No results found.</div>;
  }

  return (
    <div style={card.base}>
      <div style={card.header}>
        <h2>Search Results ({videos.length})</h2>
      </div>
      
      <div style={table.wrapper}>
        <table style={table.base}>
          <thead>
            <tr>
              <th style={table.th}>No</th>
              <th style={table.th}>Thumbnail</th>
              <th style={table.th}>Title</th>
              <th style={table.th}>Channel</th>
              <th style={table.th}>Published</th>
              <th style={table.th}>Views</th>
              <th style={table.th}>Likes</th>
              <th style={table.th}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={video.id}>
                <td style={table.td}>{index + 1}</td>
                <td style={table.td}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={styles.thumbnail}
                  />
                </td>
                <td style={{...table.td, ...styles.titleCell}}>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {video.title}
                  </a>
                </td>
                <td style={table.td}>{video.channelName}</td>
                <td style={table.td}>{formatDate(video.publishedAt)}</td>
                <td style={table.td}>{formatNumber(video.viewCount)}</td>
                <td style={table.td}>{formatNumber(video.likeCount)}</td>
                <td style={table.td}>{formatNumber(video.commentCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component-specific styles
const styles = {
  titleCell: {
    maxWidth: '400px',
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
  },
  thumbnail: {
    width: '120px',
    height: '68px',
    objectFit: 'cover' as const,
    borderRadius: borderRadius.sm,
  },
};