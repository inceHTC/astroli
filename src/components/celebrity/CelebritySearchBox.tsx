"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ELEMENT_COLORS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import type { CelebrityItem } from "./CelebrityCard";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 200;
const MAX_SUGGESTIONS = 12;

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function getZodiacNameTr(zodiacId: string): string {
  const sign = ZODIAC_SIGNS.find((z) => z.id === zodiacId);
  return sign?.nameTr ?? zodiacId;
}

function getZodiacColor(zodiacId: string): string {
  const sign = ZODIAC_SIGNS.find((z) => z.id === zodiacId);
  const element = sign?.element as Element | undefined;
  return element ? (ELEMENT_COLORS[element] ?? "#6b7280") : "#6b7280";
}

type CelebritySearchBoxProps = {
  celebrities: CelebrityItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function CelebritySearchBox({
  celebrities,
  value,
  onChange,
  placeholder = "İsim veya meslek yazın ...",
  className = "",
}: CelebritySearchBoxProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = value !== undefined ? value : internalQuery;
  const setQuery = (v: string) => {
    if (onChange) onChange(v);
    else setInternalQuery(v);
  };
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query.trim().toLowerCase(), DEBOUNCE_MS);

  const suggestions = useMemo(() => {
    if (debouncedQuery.length < MIN_CHARS) return [];
    const q = debouncedQuery;
    return celebrities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.job.toLowerCase().includes(q)
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [celebrities, debouncedQuery]);

  const showDropdown = open && debouncedQuery.length >= MIN_CHARS;

  useEffect(() => {
    setHighlight(0);
  }, [suggestions]);

  useEffect(() => {
    if (!showDropdown || highlight < 0 || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlight, showDropdown]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === "Escape") setQuery("");
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlight((h) => (h < suggestions.length - 1 ? h + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => (h > 0 ? h - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (suggestions[highlight]) {
          const name = suggestions[highlight].name;
          setQuery(name);
          onChange?.(name);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden
        >
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay so click on suggestion can fire
            setTimeout(() => setOpen(false), 180);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="celebrity-suggestions"
          aria-activedescendant={showDropdown && suggestions[highlight] ? `suggestion-${suggestions[highlight].id}` : undefined}
          id="celebrity-search"
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-12 text-base text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#5B3FFF] focus:ring-2 focus:ring-[#5B3FFF]/20"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Temizle"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="celebrity-suggestions"
          role="listbox"
          ref={listRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(70vh,420px)] overflow-auto rounded-2xl border border-gray-200 bg-white py-2 shadow-xl"
        >
          {suggestions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              &ldquo;{query}&rdquo; ile eşleşen ünlü bulunamadı.
            </div>
          ) : (
            suggestions.map((c, i) => (
              <button
                key={c.id}
                type="button"
                id={`suggestion-${c.id}`}
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => {
                  setQuery(c.name);
                  onChange?.(c.name);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition ${
                  i === highlight ? "bg-[#5B3FFF]/10" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl text-gray-300">
                      ♈
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{c.name}</p>
                  <p className="text-sm text-gray-500 truncate">{c.job}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: getZodiacColor(c.zodiac) }}
                >
                  {getZodiacNameTr(c.zodiac)}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {query.length > 0 && query.length < MIN_CHARS && (
        <p className="mt-2 text-sm text-gray-500">
          En az {MIN_CHARS} harf yazın, ilgili ünlüler listelenecek.
        </p>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
