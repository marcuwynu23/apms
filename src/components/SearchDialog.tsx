"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, X, ArrowRight, Package, Users, Wrench, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Open dialog (handled by parent)
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleResultClick = (result: any) => {
    router.push(result.url);
    onClose();
    setQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'asset': return <Package size={16} className="text-blue-600" />;
      case 'assignment': return <Users size={16} className="text-green-600" />;
      case 'maintenance': return <Wrench size={16} className="text-orange-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search size={20} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets, assignments, maintenance..."
            className="flex-1 outline-none text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 rounded hover:bg-secondary/50 transition-colors text-left"
                >
                  {getIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Type to search across all assets, assignments, and maintenance records</p>
              <p className="text-xs mt-2 text-muted-foreground/60">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/20 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border">Enter</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white rounded border">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
