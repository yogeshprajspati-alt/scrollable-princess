"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { THIRD_BEATS, THIRD_FRAME_COUNT, thirdFramePath } from "@/lib/third";

export function ThirdSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const h2TitleRef = useRef<HTMLHeadingElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const seqReadoutRef = useRef<HTMLSpanElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef("");

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleBeats, setVisibleBeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= THIRD_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = thirdFramePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / THIRD_FRAME_COUNT);
        if (loadedCount === THIRD_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / THIRD_FRAME_COUNT);
        if (loadedCount === THIRD_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        const frameIndex = Math.min(
          THIRD_FRAME_COUNT - 1,
          Math.floor(progress * THIRD_FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (h2TitleRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.45) / 0.15));
          h2TitleRef.current.style.opacity = String(op);
          h2TitleRef.current.style.transform = `translateY(${(1 - op) * 10}px)`;
        }

        if (outroRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.88) / 0.08));
          outroRef.current.style.opacity = String(op);
          outroRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (seqReadoutRef.current) {
          const n = Math.min(THIRD_FRAME_COUNT, frameIndex + 1);
          seqReadoutRef.current.textContent =
            `SEQ ${String(n).padStart(3, "0")} / ${THIRD_FRAME_COUNT}`;
        }

        const newVisible = new Set<string>();
        for (const b of THIRD_BEATS) {
          if (progress >= b.show && progress <= b.hide) newVisible.add(b.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleBeats(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <section
      ref={sectionRef}
      id="evolution"
      className="scroll-animation relative border-t border-white/5 bg-background"
    >
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
          }}
        />

        <div className="pointer-events-none absolute left-6 top-28 z-10 flex max-w-[46ch] flex-col items-start gap-5 md:left-12 md:top-32">
          <span className="font-serif italic text-accent tracking-wide text-sm md:text-base">Infinite Evolution</span>
          <h2
            ref={h2TitleRef}
            className="font-serif text-4xl font-semibold leading-[0.98] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            style={{ opacity: 0, transition: "opacity 240ms ease-out" }}
          >
            The Ultimate
            <br />
            <span className="text-accent">Transformation.</span>
          </h2>
          <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
            Journeying toward excellence. Prachii has transcended all limits — where grace meets power.
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/40" />
          <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-zinc-500">
            Evolution Log &mdash; Radiant
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span
            ref={seqReadoutRef}
            className="font-sans text-[10px] uppercase tracking-[0.28em] text-accent font-medium"
          >
            SEQ 001 / {THIRD_FRAME_COUNT}
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent/80"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/5 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent/60"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-sans text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span>PRACHIII // GROWTH</span>
            <span>U.P.G.R.A.D.E // SUCCESS</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {THIRD_BEATS.map((b, i) => {
          const visible = visibleBeats.has(b.id);
          const position =
            i === 0
              ? "top-[24%] right-6 md:right-12"
              : i === 1
              ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
              : "bottom-24 right-6 md:bottom-28 md:right-12";
          return (
            <div
              key={b.id}
              className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block text-right`}
            >
              <figure
                className={`card-surface pointer-events-auto p-8 transition-all duration-700 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ borderRadius: "24px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(234, 188, 203, 0.1)" }}
              >
                <span className="font-serif italic text-sm tracking-wide text-accent">
                  {b.label}
                </span>
                <blockquote className="mt-4 font-serif text-2xl font-medium leading-snug tracking-tight text-foreground italic">
                  &ldquo;{b.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between">
                  <span className="font-sans text-sm text-zinc-400">{b.speaker}</span>
                  <span className="font-serif italic text-xs text-accent">
                    {b.film}
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-[36%] z-20 flex flex-col gap-4 px-6 md:hidden">
          {THIRD_BEATS.map((b) => {
            const visible = visibleBeats.has(b.id);
            return (
              <figure
                key={b.id}
                className={`card-surface pointer-events-auto p-6 transition-all duration-700 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ borderRadius: "20px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(234, 188, 203, 0.1)" }}
              >
                <span className="font-serif italic text-xs tracking-wide text-accent">
                  {b.label}
                </span>
                <blockquote className="mt-3 font-serif text-lg font-medium leading-snug text-foreground italic">
                  &ldquo;{b.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-xs text-zinc-300">{b.speaker}</span>
                  <span className="font-serif italic text-[10px] text-accent">
                    {b.film}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div
          ref={outroRef}
          className="pointer-events-none absolute bottom-24 left-6 z-10 flex flex-col items-start gap-5 md:bottom-32 md:left-12"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="font-serif italic text-sm tracking-wide text-accent">
            Final Phase &mdash; Complete
          </span>
          <a
            href="#systems"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] active:translate-y-[1px]"
          >
            System Report
            <span aria-hidden>&darr;</span>
          </a>
        </div>

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-background px-6">
            <span className="font-serif italic text-accent text-lg">Reconstructing Growth...</span>
            <div className="h-px w-60 bg-white/5 md:w-80">
              <div
                className="h-full bg-accent/60 transition-[width] duration-300 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
