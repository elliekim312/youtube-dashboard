'use client';

import { VideoData } from '@/types/search.types';

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
    return <div className="text-center py-8 text-gray-600">Loading data...</div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-8 text-gray-600">No results found.</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Search Results ({videos.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video, index) => (
              <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-[120px] h-[68px] object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {video.title}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.channelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(video.publishedAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(video.viewCount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(video.likeCount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(video.commentCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}