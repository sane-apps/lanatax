"use client";

const STORAGE_KEY = "lanatax_ref_source";
const VALID_REF = /^[a-z0-9_-]{1,32}$/i;

export function getReferralSource(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref && VALID_REF.test(ref)) {
    window.localStorage.setItem(STORAGE_KEY, ref);
    return ref;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && VALID_REF.test(stored) ? stored : null;
}

export function withReferralSource(url: string): string {
  const source = getReferralSource();
  if (!source) return url;

  try {
    const target = new URL(url);
    if (!target.searchParams.has("src")) {
      target.searchParams.set("src", source);
    }
    return target.toString();
  } catch {
    return url;
  }
}
