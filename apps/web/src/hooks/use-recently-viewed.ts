import { useState, useEffect, useCallback } from "react";

const MAX_ITEMS = 6;
const UPDATE_EVENT = "recently-viewed-updated";

export const RECENTLY_VIEWED_KEYS = {
  doctors: "recently-viewed-doctors",
  hospitals: "recently-viewed-hospitals",
} as const;

export type RecentlyViewedKey =
  (typeof RECENTLY_VIEWED_KEYS)[keyof typeof RECENTLY_VIEWED_KEYS];

function readStorage<T extends { id: string }>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveRecentlyViewed<T extends { id: string }>(
  key: string,
  item: T,
): void {
  const existing = readStorage<T>(key);
  const deduped = existing.filter((i) => i.id !== item.id);
  const updated = [item, ...deduped].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: key }));
  } catch {}
}

export function clearRecentlyViewed(key: string): void {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: key }));
  } catch {}
}

export function useRecentlyViewed<T extends { id: string }>(
  key: string,
): { items: T[]; clear: () => void } {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(readStorage<T>(key));

    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === key) {
        setItems(readStorage<T>(key));
      }
    };

    // cross-tab sync
    const storageHandler = (e: StorageEvent) => {
      if (e.key === key) setItems(readStorage<T>(key));
    };

    window.addEventListener(UPDATE_EVENT, handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [key]);

  const clear = useCallback(() => clearRecentlyViewed(key), [key]);

  return { items, clear };
}
