import { useState, useMemo } from 'react';

interface UseFilteredPaginationOptions<T> {
  items: T[];
  filterFn: (item: T, searchTerm: string) => boolean;
  initialPerPage?: number;
}

interface UseFilteredPaginationResult<T> {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  perPage: number;
  setPerPage: (value: number) => void;
  filteredItems: T[];
  paginatedItems: T[];
  onSetPage: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => void;
  onPerPageSelect: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number, newPage: number) => void;
}

export function useFilteredPagination<T>({
  items,
  filterFn,
  initialPerPage = 20,
}: UseFilteredPaginationOptions<T>): UseFilteredPaginationResult<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => filterFn(item, searchTerm));
  }, [items, searchTerm, filterFn]);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  return {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    perPage,
    setPerPage,
    filteredItems,
    paginatedItems,
    onSetPage,
    onPerPageSelect,
  };
}
