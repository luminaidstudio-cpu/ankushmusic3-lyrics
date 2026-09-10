"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InteractionFX() {
  const router = useRouter();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const navigating = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const move = (event: MouseEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      document.body.classList.add("am3-cursor-active");
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.24;
      pos.current.y += (target.current.y - pos.current.y) * 0.24;
      cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      ring.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf.current = requestAnimationFrame(animate);
    };

    const over = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      if (el?.closest("a, button, input, textarea, [role='button']")) {
        document.body.classList.add("am3-cursor-hover");
      }
    };
    const out = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      if (el?.closest("a, button, input, textarea, [role='button']")) {
        document.body.classList.remove("am3-cursor-hover");
      }
    };

    const burst = (x: number, y: number) => {
      const layer = document.createElement("div");
      layer.className = "click-vfx";
      layer.style.left = `${x}px`;
      layer.style.top = `${y}px`;
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("i");
        particle.style.setProperty("--angle", `${i * 30}deg`);
        particle.style.setProperty("--distance", `${28 + (i % 3) * 12}px`);
        layer.appendChild(particle);
      }
      document.body.appendChild(layer);
      window.setTimeout(() => layer.remove(), 650);
    };

    const click = (event: MouseEvent) => {
      burst(event.clientX, event.clientY);
      const el = (event.target as HTMLElement | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!el || event.defaultPrevented || el.target === "_blank" || el.download || el.href.startsWith("mailto:") || el.href.startsWith("tel:")) return;
      const url = new URL(el.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      event.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      document.body.classList.add("am3-page-transition");
      window.setTimeout(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
        window.setTimeout(() => {
          document.body.classList.remove("am3-page-transition");
          navigating.current = false;
        }, 260);
      }, 160);
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("click", click, true);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("click", click, true);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.body.classList.remove("am3-cursor-active", "am3-cursor-hover", "am3-page-transition");
    };
  }, [router]);

  return (
    <>
      <div ref={ringRef} className="am3-cursor-ring" aria-hidden="true" />
      <div ref={cursorRef} className="am3-cursor" aria-hidden="true">
        <svg viewBox="0 0 28 34" role="presentation">
          <path d="M3 2.5 24.8 18l-9.2 1.5 5.1 9.2-4.8 2.7-5.3-9.4-5.2 7.4L3 2.5Z" />
        </svg>
      </div>
      <div className="page-transition" aria-hidden="true">
        <span>AM3</span>
      </div>
    </>
  );
}
