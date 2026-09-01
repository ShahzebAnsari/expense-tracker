"use client";

import { useCallback, useSyncExternalStore } from "react";

type CacheEntry = {
  raw: string | null;
  parsed: unknown;
};

const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string) {
  return (onStoreChange: () => void) => {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }

    listeners.get(key)!.add(onStoreChange);

    return () => {
      listeners.get(key)?.delete(onStoreChange);
    };
  };
}

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

  cache.set(key, {
    raw,
    parsed,
  });

  return parsed;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(
    () => readValue(key, initialValue),
    [key, initialValue]
  );

  const getServerSnapshot = useCallback(
    () => initialValue,
    [initialValue]
  );

  const value = useSyncExternalStore(
    subscribe(key),
    getSnapshot,
    getServerSnapshot
  );

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readValue(key, initialValue);

      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(prev)
          : next;

      try {
        const raw = JSON.stringify(resolved);

        window.localStorage.setItem(key, raw);

        cache.set(key, {
          raw,
          parsed: resolved,
        });
      } catch {
        // Storage unavailable/full — fail silently.
      }

      notify(key);
    },
    [key, initialValue]
  );

  /*
   * IMPORTANT:
   *
   * Do not use:
   *
   *   typeof window !== "undefined"
   *
   * for hydration state.
   *
   * The server and client's first render must agree.
   */
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot
  );

  return [value, update, hydrated] as const;
}

let isHydrated = false;
const hydrationListeners = new Set<() => void>();

function subscribeHydration(listener: () => void) {
  hydrationListeners.add(listener);

  return () => {
    hydrationListeners.delete(listener);
  };
}

function getHydratedSnapshot() {
  return isHydrated;
}

function getServerHydrationSnapshot() {
  return false;
}

if (typeof window !== "undefined") {
  queueMicrotask(() => {
    isHydrated = true;

    hydrationListeners.forEach((listener) => listener());
  });
}