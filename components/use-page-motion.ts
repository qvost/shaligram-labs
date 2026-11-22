"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, type RefObject } from "react";

gsap.registerPlugin(SplitText);

export function usePageMotion(main: RefObject<HTMLElement | null>, path: string) {
  useEffect(() => {
    const page = main.current;
    if (!page) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let disposed = false;
      const titles: { split: SplitText; element: Element; label: string | null }[] = [];
      const motion = gsap.context(() => {}, page);
      const observer = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
          if (disposed || !isIntersecting) continue;
          observer.unobserve(target);

          motion.add(() => {
            if (target.hasAttribute("data-motion-title")) {
              const label = target.getAttribute("aria-label");
              const text = target instanceof HTMLElement
                ? target.innerText.replace(/\s+/g, " ").trim()
                : target.textContent;
              let entered = false;
              const split = SplitText.create(target, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: ({ lines }) => {
                  if (text) target.setAttribute("aria-label", text);
                  return gsap.from(lines, {
                    yPercent: 105,
                    duration: entered ? 0 : 0.68,
                    stagger: entered ? 0 : 0.075,
                    ease: "power3.out",
                    clearProps: "transform",
                    onComplete: () => { entered = true; },
                  });
                },
              });
              titles.push({ split, element: target, label });
            } else {
              gsap.fromTo(target.querySelectorAll(".wire-line"), {
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }, {
                strokeDashoffset: 0,
                duration: 0.95,
                stagger: { each: 0.035, from: "center" },
                ease: "power2.out",
                clearProps: "strokeDasharray,strokeDashoffset",
              });
            }
          });
        }
      });

      void document.fonts.ready.then(() => {
        if (disposed) return;
        page.querySelectorAll("[data-motion-title], [data-motion-wire]")
          .forEach((element) => observer.observe(element));
      });

      return () => {
        disposed = true;
        observer.disconnect();
        motion.revert();
        titles.forEach(({ split, element, label }) => {
          split.revert();
          if (label === null) element.removeAttribute("aria-label");
          else element.setAttribute("aria-label", label);
        });
      };
    });

    return () => media.revert();
  }, [main, path]);
}
