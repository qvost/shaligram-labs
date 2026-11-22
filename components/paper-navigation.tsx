"use client";

import { useEffect, useRef, useState } from "react";

type PaperLink = { id: string; title: string };

export function PaperNavigation({ items }: { items: PaperLink[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const activeId = useRef(active);
  const root = useRef<HTMLElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nav = root.current;
    if (!nav) return;
    let frame = 0;
    let disposed = false;

    const update = () => {
      frame = 0;
      const sections = items.flatMap((item) => {
        const element = document.getElementById(item.id);
        return element ? [{ id: item.id, bounds: element.getBoundingClientRect() }] : [];
      });
      const first = sections[0];
      const last = sections[sections.length - 1];
      if (!first || !last) return;
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 72;
      const anchorOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const threshold = Math.max(headerBottom + 24, anchorOffset) + 1;
      let current = first.id;
      for (const section of sections) {
        if (section.bounds.top <= threshold) current = section.id;
      }
      const atBottom = window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom && last.bounds.top < innerHeight) current = last.id;
      const links = nav.querySelectorAll<HTMLAnchorElement>("a");
      const link = Array.from(links).find((item) => item.hash === "#" + current);
      if (link && marker.current) {
        marker.current.style.transform = `translateY(${link.offsetTop}px)`;
        marker.current.style.height = link.offsetHeight + "px";
      }
      const travel = Math.max(1, last.bounds.bottom - first.bounds.top - (innerHeight - threshold));
      const fraction = Math.max(0, Math.min(1, (threshold - first.bounds.top) / travel));
      if (progress.current) progress.current.style.transform = `scaleX(${fraction})`;
      if (current !== activeId.current) {
        activeId.current = current;
        setActive(current);
      }
    };

    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(nav);
    const article = document.querySelector(".paper-body");
    if (article) observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    update();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <aside className="paper-toc">
      <span>In this paper</span>
      <div className="paper-reading-progress" aria-hidden="true">
        <span ref={progress} />
      </div>
      <nav ref={root} className="paper-toc-links" aria-label="Paper sections">
        <span ref={marker} className="paper-toc-marker" aria-hidden="true" />
        {items.map((item) => (
          <a
            key={item.id}
            href={"#" + item.id}
            aria-current={active === item.id ? "location" : undefined}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
