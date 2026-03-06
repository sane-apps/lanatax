"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // ignore
    }
  }, [key]);

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
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(item);
      }
    } catch {
      // ignore
    }
  }, [key]);

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
