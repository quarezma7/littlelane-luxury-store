import { useState, useCallback } from 'react';
export function useModal(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const [data, setData] = useState(null);
  const open = useCallback((d = null) => { setData(d); setIsOpen(true); }, []);
  const close = useCallback(() => { setIsOpen(false); setData(null); }, []);
  return { isOpen, open, close, data };
}
