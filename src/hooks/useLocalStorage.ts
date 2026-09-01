"use client";

import { useCallback, useSyncExternalStore } from "react";

type CacheEntry = { raw: string | null; parsed: unknown };

const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string) {
  return (onStoreChange: () => void) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(onStoreChange);
    return () => {
      listeners.get(key)?.delete(onStoreChange);
    };
  };
}

/**
 * Reads localStorage for `key`, but only re-parses JSON when the raw string
 * has actually changed since the last read. This keeps the returned reference
 * stable across renders, which useSyncExternalStore requires to avoid
 * re-render loops.
 */
function readValue<T>(key: string, initialValue: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return initialValue;
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) {
    return cached.parsed as T;
  }

  let parsed: T;
  try {
    parsed = raw != null ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    parsed = initialValue;
  }
  cache.set(key, { raw, parsed });
  return parsed;
}

/**
 * A useState-like hook that persists to localStorage. Uses useSyncExternalStore
 * so the server snapshot (initialValue) and client snapshot (localStorage) are
 * reconciled the React-approved way, without setState-in-effect footguns.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(() => readValue(key, initialValue), [key, initialValue]);
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe(key), getSnapshot, getServerSnapshot);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readValue(key, initialValue);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      try {
        const raw = JSON.stringify(resolved);
        window.localStorage.setItem(key, raw);
        cache.set(key, { raw, parsed: resolved });
      } catch {
        // storage full or unavailable — fail silently
      }
      notify(key);
    },
    [key, initialValue]
  );

  // True once running on the client (past SSR). Callers use this to avoid
  // rendering localStorage-derived UI before the real snapshot is available.
  const hydrated = typeof window !== "undefined";

  return [value, update, hydrated] as const;
}
