"use client";

import { useState, useCallback, useRef } from "react";
import { fetchAllTransactions, HeliusFetchError } from "@/lib/helius";
import type { FetchState, HeliusTransaction } from "@/lib/types";

export function useTransactions() {
  const [state, setState] = useState<FetchState>({
    status: "idle",
    transactions: [],
    error: null,
    progress: { loaded: 0, total: null, currentPage: 0 },
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchTransactions = useCallback(
    async (wallet: string, apiKey: string) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        status: "loading",
        transactions: [],
        error: null,
        progress: { loaded: 0, total: null, currentPage: 0 },
      });

      try {
        const transactions = await fetchAllTransactions(
          wallet,
          apiKey,
          (progress) => {
            setState((prev) => ({
              ...prev,
              progress: {
                loaded: progress.loaded,
                total: null,
                currentPage: progress.currentPage,
              },
            }));
          },
          controller.signal
        );

        setState({
          status: "success",
          transactions,
          error: null,
          progress: {
            loaded: transactions.length,
            total: transactions.length,
            currentPage: 0,
          },
        });

        return transactions;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            status: "cancelled",
            error: "Fetch cancelled",
          }));
          return null;
        }

        const message =
          err instanceof HeliusFetchError
            ? err.message
            : "An unexpected error occurred";

        setState((prev) => ({
          ...prev,
          status: "error",
          error: message,
        }));
        return null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({
      status: "idle",
      transactions: [],
      error: null,
      progress: { loaded: 0, total: null, currentPage: 0 },
    });
  }, []);

  const setTransactions = useCallback((txs: HeliusTransaction[]) => {
    setState({
      status: "success",
      transactions: txs,
      error: null,
      progress: { loaded: txs.length, total: txs.length, currentPage: 0 },
    });
  }, []);

  return {
    ...state,
    fetchTransactions,
    cancel,
    reset,
    setTransactions,
  };
}
