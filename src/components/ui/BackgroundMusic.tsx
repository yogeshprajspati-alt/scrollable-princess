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
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4">
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
        className="pointer-events-auto select-none rounded-full border border-white/20 bg-black/50 px-3 py-2 text-sm font-medium text-white shadow-sm backdrop-blur hover:bg-black/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => {
          if (!isSrcAvailable) return;

          const nextMuted = !isMuted;
          setIsMuted(nextMuted);

          const el = audioRef.current;
          if (!startedRef.current || !el) return;

          if (!nextMuted) {
            // Unmuting after start: try to resume.
            try {
              void el.play().catch(() => {
                // ignore
              });
            } catch {
              // ignore
            }
          } else {
            // Muting: pause to prevent audible sound.
            try {
              el.pause();
            } catch {
              // ignore
            }
            stopAndReset();
          }
        }}
      >
        {!isSrcAvailable ? "🎵 Music Unavailable" : isMuted ? "🔇 Music Off" : "🔊 Music On"}
      </button>
    </div>
  );
}
