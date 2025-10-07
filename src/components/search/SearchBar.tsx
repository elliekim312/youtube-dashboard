'use client';

import { useState } from 'react';

export type SearchType = 'channel' | 'keywords' | 'all';

interface SearchBarProps {
  onSearch: (keyword: string, searchType: SearchType, minSubscribers: number, maxSubscribers: number, minViews: number) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [minSubscribers, setMinSubscribers] = useState<number>(1500);
  const [maxSubscribers, setMaxSubscribers] = useState<number>(10000);
  const [minViews, setMinViews] = useState<number>(10000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim(), searchType, minSubscribers, maxSubscribers, minViews);
    }
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case 'channel':
        return 'Enter channel name to search...';
      case 'keywords':
        return 'Enter keywords to search...';
      case 'all':
        return 'Enter channel or keywords to search...';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-md border border-gray-200">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="search-type" className="text-sm font-medium text-gray-700">
              Search Type
            </label>
            <select
              id="search-type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as SearchType)}
              className="h-[42px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <option value="all">All</option>
              <option value="keywords">Video Keywords</option>
              <option value="channel">Channel Name</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="search-input" className="text-sm font-medium text-gray-700">
              Keyword
            </label>
            <input
              id="search-input"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={getPlaceholder()}
              className="h-[42px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 invisible">Search</label>
            <button
              type="submit"
              className="h-[42px] px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              disabled={loading || !keyword.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="min-subscribers" className="text-sm font-medium text-gray-700">
              Min Subscribers
            </label>
            <input
              id="min-subscribers"
              type="number"
              value={minSubscribers}
              onChange={(e) => setMinSubscribers(Number(e.target.value))}
              placeholder="1500"
              className="h-[42px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="max-subscribers" className="text-sm font-medium text-gray-700">
              Max Subscribers
            </label>
            <input
              id="max-subscribers"
              type="number"
              value={maxSubscribers}
              onChange={(e) => setMaxSubscribers(Number(e.target.value))}
              placeholder="10000"
              className="h-[42px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label htmlFor="min-views" className="text-sm font-medium text-gray-700">
              Min Views
            </label>
            <input
              id="min-views"
              type="number"
              value={minViews}
              onChange={(e) => setMinViews(Number(e.target.value))}
              placeholder="10000"
              className="h-[42px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </form>
  );
}