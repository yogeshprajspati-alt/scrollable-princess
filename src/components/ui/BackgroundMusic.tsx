                        "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_SRC = "/music/background.mp3";
const DEFAULT_LOOP = true;
const DEFAULT_VOLUME = 1; // full volume per your requirement

function getSafeAudioVolume() {
  // Some browsers expect 0..1
  return Math.min(1, Math.max(0, DEFAULT_VOLUME));
}

export function BackgroundMusic({
  src = DEFAULT_SRC,
  loop = DEFAULT_LOOP,
  defaultMuted = false,
}: {
  src?: string;
  loop?: boolean;
  defaultMuted?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [isSrcAvailable, setIsSrcAvailable] = useState(true);

  const volume = useMemo(() => getSafeAudioVolume(), []);

  const stopStartListeners = useRef<(() => void) | null>(null);

  const stopAndReset = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.pause();
      // Resetting currentTime helps prevent long tail if user toggles quickly.
      el.currentTime = 0;
    } catch {
      // ignore
    }
  }, []);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    try {
      if (!audioRef.current) {
        const el = new Audio(src);

        // If the mp3 is missing/invalid, this will fire and we can update UI.
        el.addEventListener(
          "error",
          () => {
            setIsSrcAvailable(false);
            try {
              el.pause();
            } catch {
              // ignore
            }
          },
          { once: true }
        );

        el.loop = loop;
        el.preload = "auto";
        el.volume = volume;
        el.muted = isMuted;
        audioRef.current = el;
      } else {
        audioRef.current.loop = loop;
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
      }

      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // If playback fails (autoplay blocked or file missing),
          // we swallow to avoid crashes. UI state will update via "error" event.
        });
      }
    } catch {
      // swallow to avoid any crash on mobile
    }
  }, [isMuted, loop, src, volume]);

  const onFirstGesture = useCallback(() => {
    start();
    const stop = stopStartListeners.current;
    stop?.();
    stopStartListeners.current = null;
  }, [start]);


  useEffect(() => {
    // Mobile-safe: do NOT create/load audio until the first user gesture.
    const events: Array<keyof DocumentEventMap> = [
      "pointerdown",
      "touchstart",
      "click",
    ];

    const handlers = events.map((eventName) => {
      const handler = () => onFirstGesture();
      document.addEventListener(eventName, handler, {
        passive: true,
        once: true,
      });
      return () => document.removeEventListener(eventName, handler);
    });

    stopStartListeners.current = () => {
      for (const cleanup of handlers) cleanup();
    };

    return () => {
      stopStartListeners.current?.();
      stopStartListeners.current = null;
    };
  }, [onFirstGesture]);

  useEffect(() => {
    // Keep audio mute state in sync with UI toggle.
    const el = audioRef.current;
    if (!el) return;
    try {
      el.muted = isMuted;
    } catch {
      // ignore
    }
  }, [isMuted]);

  useEffect(() => {
    // If user switches tabs/background, pause to avoid noisy playback.
    const onVisibility = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.visibilityState === "hidden") {
        try {
          el.pause();
        } catch {
          // ignore
        }
      } else {
        // On return, don't auto-play unless it was already started via a gesture.
        if (startedRef.current && !isMuted) {
          try {
            void el.play().catch(() => {
              // ignore
            });
          } catch {
            // ignore
          }
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isMuted]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-end px-6 md:px-12">
      <button
        type="button"
        disabled={!isSrcAvailable}
        aria-label={
          !isSrcAvailable
            ? "Background music unavailable"
            : isMuted
              ? "Unmute background music"
              : "Mute background music"
        }
        className="pointer-events-auto group relative flex items-center gap-3 select-none rounded-full border border-white/10 bg-black/40 px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-black/60 hover:border-accent/30 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          if (!isSrcAvailable) return;

          const nextMuted = !isMuted;
          setIsMuted(nextMuted);

          const el = audioRef.current;
          if (!startedRef.current || !el) return;

          if (!nextMuted) {
            try {
              void el.play().catch(() => {});
            } catch {}
          } else {
            try {
              el.pause();
            } catch {}
            stopAndReset();
          }
        }}
      >
        <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isMuted ? "bg-zinc-500" : "bg-accent shadow-[0_0_8px_rgba(234,188,203,0.8)]"}`} />
        <span className="opacity-80 group-hover:opacity-100 transition-opacity">
          {!isSrcAvailable ? "Unavailable" : isMuted ? "Melody Off" : "Melody On"}
        </span>
      </button>
    </div>
  );
}
