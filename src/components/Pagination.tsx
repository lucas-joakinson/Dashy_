import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(p => 
    p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-hover-bg border border-border-primary text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-text-secondary font-mono opacity-50">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl font-mono text-sm border transition-all ${
                  currentPage === page
                    ? 'bg-primary-500 border-primary-400 text-white shadow-glow-purple'
                    : 'bg-hover-bg border-border-primary text-text-secondary hover:border-primary-500/50'
                }`}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-hover-bg border border-border-primary text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
