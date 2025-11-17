'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onQueryChange?: (query: string) => void;
  showAutocomplete?: boolean;
  isLoading?: boolean;
  defaultValue?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder,
  onSearch,
  onQueryChange,
  showAutocomplete = true,
  isLoading = false,
  defaultValue = '',
  debounceMs = 300,
}: SearchInputProps) {
  const t = useTranslations('search');
  const [query, setQuery] = useState(defaultValue);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue);

  // Debounce the query for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (showAutocomplete && onQueryChange) {
        onQueryChange(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, showAutocomplete, onQueryChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    if (onQueryChange) {
      onQueryChange('');
    }
  }, [onQueryChange]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    },
    [query, onSearch]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('searchPlaceholder')}
          className="pl-10 pr-20 h-11 rounded-2xl bg-search-light dark:bg-search-dark border-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {query && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 w-7 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">{t('clear')}</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
