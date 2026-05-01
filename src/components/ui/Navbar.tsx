"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-[13px] font-semibold italic uppercase tracking-[0.2em] text-foreground"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(234,188,203,0.8)]"
          />
          Princess / Prachii
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#cinematic"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Vision
          </a>
          <a
            href="#evolution"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Growth
          </a>
          <a
            href="#systems"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Report
          </a>
          <a
            href="#footer"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Archive
          </a>
        </nav>

        <a
          href="#systems"
          className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] active:translate-y-[1px]"
        >
          Explore
          <ArrowUpRight
            size={14}
            weight="bold"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </header>
  );
}
