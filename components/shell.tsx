"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LabMark } from "./lab-mark";
import { LabCursor } from "./lab-cursor";
import { usePageCurtain } from "./use-page-curtain";
import { usePageMotion } from "./use-page-motion";

gsap.registerPlugin(ScrollTrigger);
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const navigate = usePageCurtain(curtain, path);
  usePageMotion(main, path);
  useEffect(() => {
    const mm = gsap.matchMedia();
    let lenis: Lenis | undefined;
    let frame = 0;
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      lenis = new Lenis();
      const tick = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      lenis.on("scroll", ScrollTrigger.update);
      return () => {
        cancelAnimationFrame(frame);
        lenis?.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="brand" href="/" onNavigate={(e) => navigate(e, "/")}>
          <LabMark /> SHALIGRAM LABS
        </Link>
        <nav aria-label="Main navigation">
          {[
            ["Research", "/research"],
            ["Reify", "/systems/reify"],
            ["Manifesto", "/manifesto"],
          ].map(([label, url]) => (
            <Link
              key={url}
              aria-current={
                path === url || path.startsWith(`${url}/`) ? "page" : undefined
              }
              href={url}
              onNavigate={(e) => navigate(e, url)}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/qvost/reify"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>
      <LabCursor />
      <main id="main" ref={main}>
        {children}
      </main>
      <footer>
        <div className="footer-top">
          <div className="footer-credit">
            <span className="mono muted">Designed &amp; built by</span>
            <a
              className="footer-author"
              href="https://github.com/qvost"
              target="_blank"
              rel="noopener noreferrer"
            >
              qvost<span className="mono">Siddid Pandey</span>
            </a>
            <span className="mono muted">Kathmandu, Nepal</span>
          </div>
          <ul className="footer-connections" aria-label="Connect with qvost">
            <li>
              <a
                href="https://github.com/qvost"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span>@qvost</span>
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/qvost"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <span>/in/qvost</span>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/qvostlost"
                target="_blank"
                rel="noopener noreferrer"
              >
                X <span>@qvostlost</span>
              </a>
            </li>
            <li>
              <a href="mailto:qvostwon@gmail.com">
                Email <span>qvostwon@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
        <Link className="footer-logo" href="/" aria-label="Shaligram Labs home">
          <img src="/brand/logo.svg" alt="" width="176" height="204" />
        </Link>
        <div className="footer-bottom mono">
          <span>© {new Date().getFullYear()} SHALIGRAM LABS</span>
          <a href="https://github.com/qvost/reify">Source on GitHub</a>
        </div>
      </footer>
      <div ref={curtain} className="curtain" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} />
        ))}
      </div>
    </>
  );
}
