'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Props for the SearchInput component
 */
interface SearchInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Callback when search is submitted (Enter key or form submit) */
  onSearch: (query: string) => void;
  /** Callback when query changes (debounced for autocomplete) */
  onQueryChange?: (query: string) => void;
  /** Whether to enable autocomplete behavior */
  showAutocomplete?: boolean;
  /** Whether to show loading spinner */
  isLoading?: boolean;
  /** Default value for the input */
  defaultValue?: string;
  /** Debounce delay in milliseconds. Defaults to 300ms */
  debounceMs?: number;
}

/**
 * Search Input Component
 * 
 * A search input field with debouncing, autocomplete support, and loading states.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <SearchInput 
 *   onSearch={(query) => router.push(`/search?q=${query}`)}
 * />
 * 
 * // With autocomplete
 * <SearchInput 
 *   onSearch={handleSearch}
 *   onQueryChange={handleQueryChange}
 *   showAutocomplete={true}
 *   isLoading={isSearching}
 * />
 * 
 * // With custom debounce and default value
 * <SearchInput 
 *   onSearch={handleSearch}
 *   defaultValue="botox"
 *   debounceMs={500}
 *   placeholder="Search treatments..."
 * />
 * ```
 * 
 * Features:
 * - Debounced input for performance (default 300ms)
 * - Clear button when input has value
 * - Loading spinner during search
 * - Enter key submission
 * - Rounded design with muted background
 * - Search icon indicator
 * 
 * Translation Keys Used:
 * - `search.searchPlaceholder` - Default placeholder text
 * - `search.clear` - Clear button aria-label
 * 
 * @param {SearchInputProps} props - Component props
 * @returns {JSX.Element} The search input component
 */
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
          className="pl-10 pr-20 h-11 rounded-2xl bg-muted border-none focus-visible:ring-2 focus-visible:ring-primary"
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
