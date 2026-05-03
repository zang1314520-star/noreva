"use client";

import { useState, useEffect, useCallback } from "react";

const WISHLIST_KEY = "noreva-wishlist";
const RECENT_KEY = "noreva-recent";
const MAX_RECENT = 12;

// ========== Wishlist ==========
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}
  }, []);

  const save = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const clear = useCallback(() => save([]), [save]);

  return { ids, count: ids.length, toggle, has, clear };
}

// ========== Recently Viewed ==========
export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {}
  }, []);

  const add = useCallback((id: string) => {
    setIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { ids, add };
}
