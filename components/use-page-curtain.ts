"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type RefObject } from "react";

export function usePageCurtain(curtain: RefObject<HTMLDivElement | null>, path: string) {
  const router = useRouter();
  const origin = useRef(path);
  const destination = useRef<string | null>(null);
  const phase = useRef<"idle" | "covering" | "waiting" | "opening">("idle");
  const tween = useRef<gsap.core.Tween | null>(null);
  const timeout = useRef<number | undefined>(undefined);

  const clear = useCallback(() => {
    phase.current = "idle";
    destination.current = null;
    window.clearTimeout(timeout.current);
    tween.current?.kill();
    tween.current = null;
    const cover = curtain.current;
    if (!cover) return;
    cover.removeAttribute("data-covering");
    gsap.set(cover.children, { clearProps: "transform,transformOrigin" });
  }, [curtain]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (!preference.matches) return;
      const next = destination.current;
      clear();
      if (next && next !== origin.current) router.push(next);
    };
    preference.addEventListener("change", syncPreference);
    window.addEventListener("popstate", clear);
    return () => {
      preference.removeEventListener("change", syncPreference);
      window.removeEventListener("popstate", clear);
      clear();
    };
  }, [router, clear]);

  useEffect(() => {
    origin.current = path;
    const cover = curtain.current;
    if (!cover?.hasAttribute("data-covering")) return;

    destination.current = null;
    phase.current = "opening";
    window.clearTimeout(timeout.current);
    tween.current?.kill();
    tween.current = gsap.to(cover.children, {
      scaleX: 0,
      transformOrigin: "right",
      stagger: 0.028,
      duration: 0.42,
      ease: "power3.inOut",
      onComplete: clear,
    });
  }, [clear, curtain, path]);

  return (event: { preventDefault: () => void }, href: string) => {
    const cover = curtain.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !cover) return;
    if (href === path && !destination.current) return;
    event.preventDefault();

    destination.current = href;
    if (phase.current === "covering") return;
    if (phase.current === "waiting") {
      if (href === path) clear();
      else router.push(href);
      return;
    }

    const from = phase.current === "opening" ? "right" : "left";
    phase.current = "covering";
    cover.setAttribute("data-covering", "");
    tween.current?.kill();
    tween.current = gsap.to(cover.children, {
      scaleX: 1,
      transformOrigin: from,
      stagger: 0.028,
      duration: 0.3,
      ease: "power3.inOut",
      onComplete: () => {
        const next = destination.current;
        if (!next || next === origin.current) {
          clear();
          return;
        }
        phase.current = "waiting";
        timeout.current = window.setTimeout(clear, 3000);
        router.push(next);
      },
    });
  };
}
