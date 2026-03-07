"use client";

import { useState, useCallback } from "react";

function readJsonValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const item = localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readStringValue(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;

  try {
    const item = localStorage.getItem(key);
    return item ?? fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readJsonValue(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          console.warn("localStorage is full");
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export function useLocalStorageString(
  key: string,
  initialValue = ""
): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState(() =>
    readStringValue(key, initialValue)
  );

  const setValue = useCallback(
    (value: string) => {
      setStoredValue(value);
      try {
        localStorage.setItem(key, value);
      } catch {
        console.warn("localStorage is full");
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
