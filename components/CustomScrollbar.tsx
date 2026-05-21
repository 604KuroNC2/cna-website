"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Returns luminance 0–1 of the first opaque background found at (x, y).
// Checks both background-color (solid) and background-image (gradients).
function sampleLuminance(x: number, y: number): number {
  let el = document.elementFromPoint(x, y) as HTMLElement | null;
  while (el && el.tagName !== "HTML") {
    const style = window.getComputedStyle(el);

    // Gradient backgrounds (header/footer use linear-gradient, not background-color)
    const bgImg = style.backgroundImage;
    if (bgImg && bgImg !== "none") {
      // Try hex color first (#00002a etc.)
      const hex = bgImg.match(/#([0-9a-fA-F]{6})/);
      if (hex) {
        const r = parseInt(hex[1].slice(0, 2), 16);
        const g = parseInt(hex[1].slice(2, 4), 16);
        const b = parseInt(hex[1].slice(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
      // Try rgba(r,g,b,...) in gradient string
      const rgb = bgImg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (rgb) {
        return (0.299 * +rgb[1] + 0.587 * +rgb[2] + 0.114 * +rgb[3]) / 255;
      }
    }

    // Solid background-color
    const bg = style.backgroundColor;
    const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/);
    if (m) {
      const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
      if (alpha > 0.1 && (+m[1] + +m[2] + +m[3]) > 0) {
        return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
      }
    }

    el = el.parentElement as HTMLElement | null;
  }
  return 0.95; // fallback: assume light (body is off-white)
}

export default function CustomScrollbar() {
  const thumbRef = useRef<HTMLDivElement>(null);
  const thumbHeightRef = useRef(20);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const [hovered, setHovered] = useState(false);

  const trackW = hovered ? 14 : 8;
  const thumbW = hovered ? 10 : 5;
  const thumbInset = (trackW - thumbW) / 2;

  const update = useCallback(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight;
    const vpH = window.innerHeight;
    const maxScroll = Math.max(1, docH - vpH);

    const proportional = (vpH / docH) * vpH;
    const thumbH = Math.max(20, proportional / 3);
    const thumbTop = (scrollTop / maxScroll) * (vpH - thumbH);
    thumbHeightRef.current = thumbH;

    thumb.style.height = `${thumbH}px`;
    thumb.style.transform = `translateY(${thumbTop}px)`;

    // Sample 25px from right edge (outside the 14px-max track) at thumb centre
    const lum = sampleLuminance(window.innerWidth - 25, thumbTop + thumbH / 2);
    thumb.style.background = lum > 0.45
      ? "rgba(65, 65, 65, 0.82)"     // dark grey on light bg
      : "rgba(205, 205, 205, 0.88)"; // light grey on dark bg
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const t = setTimeout(update, 80);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, [update]);

  useEffect(() => { update(); }, [hovered, update]);

  // Drag: mousemove + mouseup on document
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const vpH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docH - vpH);
      const trackRange = Math.max(1, vpH - thumbHeightRef.current);
      const delta = ((e.clientY - dragStartY.current) / trackRange) * maxScroll;
      window.scrollTo({ top: dragStartScroll.current + delta, behavior: "instant" as ScrollBehavior });
    };
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onTrackMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const vpH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const maxScroll = Math.max(1, docH - vpH);
    const thumbH = thumbHeightRef.current;
    const trackRange = Math.max(1, vpH - thumbH);
    const newThumbTop = Math.max(0, Math.min(e.clientY - thumbH / 2, trackRange));
    const newScroll = (newThumbTop / trackRange) * maxScroll;
    window.scrollTo({ top: newScroll, behavior: "instant" as ScrollBehavior });
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = newScroll;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: `${trackW}px`,
          background: hovered ? "rgba(140, 140, 140, 0.2)" : "transparent",
          transition: "width 0.22s ease, background 0.22s ease",
          zIndex: 9998,
          cursor: "default",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={onTrackMouseDown}
      />
      <div
        ref={thumbRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          right: `${thumbInset}px`,
          top: 0,
          width: `${thumbW}px`,
          borderRadius: "99px",
          zIndex: 9999,
          pointerEvents: "none",
          transition: "width 0.22s ease, right 0.22s ease",
        }}
      />
    </>
  );
}
