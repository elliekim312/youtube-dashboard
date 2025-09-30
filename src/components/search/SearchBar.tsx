'use client';

import { useState } from 'react';
import { colors, spacing, borderRadius } from '@/styles/tokens';
import { button, input } from '@/styles/common';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.container}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to search..."
          style={{
            ...input.base,
            ...(loading && button.disabled),
          }}
          disabled={loading}
        />
        <button 
          type="submit" 
          style={{
            ...button.base,
            ...button.primary,
            ...(loading || !keyword.trim() ? button.disabled : {}),
          }}
          disabled={loading || !keyword.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    width: '100%',
    marginBottom: spacing['2xl'],
  },
  container: {
    display: 'flex',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
  },
};