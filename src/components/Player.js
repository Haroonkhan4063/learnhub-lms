"use client";
import { useEffect, useRef, useState } from "react";
import { youtubeId } from "@/lib/utils";

function Unavailable({ onRetry }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl bg-ink px-6 text-center text-white">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10.5 5-3v9l-5-3" />
        <path d="M3 3l18 18" />
      </svg>
      <p className="text-base font-semibold">Video content is currently unavailable.</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-ghost">
          Try again
        </button>
      )}
    </div>
  );
}

export default function Player({ url, title }) {
  const source = typeof url === "string" ? url.trim() : "";
  const embed = youtubeId(source);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setFailed(false);
    setAttempt(0);
  }, [source]);

  useEffect(() => {
    const el = ref.current;
    if (el && (el.error || el.networkState === 3)) setFailed(true);
  }, [source, attempt]);

  if (!source || failed) {
    return (
      <Unavailable
        onRetry={
          source
            ? () => {
                setFailed(false);
                setAttempt((n) => n + 1);
              }
            : null
        }
      />
    );
  }

  if (embed) {
    return (
      <iframe
        className="aspect-video w-full rounded-2xl bg-black"
        src={`https://www.youtube.com/embed/${embed}?rel=0`}
        title={title}
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      ref={ref}
      key={`${source}-${attempt}`}
      className="aspect-video w-full rounded-2xl bg-black"
      src={source}
      controls
      controlsList="nodownload"
      preload="auto"
      playsInline
      onError={() => setFailed(true)}
    />
  );
}
