"use client";
import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER } from "@/lib/images";

export default function SafeImage({ src, alt, className, fallback = PLACEHOLDER }) {
  const [current, setCurrent] = useState(src);
  const ref = useRef(null);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0 && current !== fallback) setCurrent(fallback);
  }, [current, fallback]);

  return (
    <img
      ref={ref}
      src={current}
      alt={alt}
      className={className}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
