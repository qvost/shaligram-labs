'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type CursorMode = 'idle' | 'link' | 'range' | 'wire' | 'native';

/** A fine-pointer cursor that fits controls without moving their hit areas. */
export function LabCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const preference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    let teardown = () => {};
    const setup = () => {
      teardown();
      if (!preference.matches) return;
      let frame = 0;
      let lastTime = 0;
      let initialized = false;
      let visible = false;
      let pressed = false;
      let mode: CursorMode = 'idle';
      let pointerX = 0, pointerY = 0;
      let currentX = 0, currentY = 0, currentWidth = 28, currentHeight = 28;
      let targetX = 0, targetY = 0, targetWidth = 28, targetHeight = 28;
      let wire: HTMLElement | null = null;
      const clearWire = () => {
        wire?.style.removeProperty('--wire-shift');
        wire = null;
      };
      const draw = (time: number) => {
        frame = 0;
        const elapsed = Math.min(64, lastTime ? time - lastTime : 16);
        lastTime = time;
        const blend = 1 - Math.exp(-elapsed / 48);
        currentX += (targetX - currentX) * blend;
        currentY += (targetY - currentY) * blend;
        currentWidth += (targetWidth - currentWidth) * blend;
        currentHeight += (targetHeight - currentHeight) * blend;
        ring.style.transform = `translate3d(${currentX - currentWidth / 2}px,${currentY - currentHeight / 2}px,0)`;
        ring.style.width = `${currentWidth}px`;
        ring.style.height = `${currentHeight}px`;
        if (visible && Math.abs(targetX-currentX)+Math.abs(targetY-currentY)+Math.abs(targetWidth-currentWidth)+Math.abs(targetHeight-currentHeight) > .15) frame = requestAnimationFrame(draw);
      };
      const wake = () => { if (!frame && visible) frame = requestAnimationFrame(draw); };
      const update = (element: Element | null) => {
        const native = element?.closest('input:not([type="range"]),textarea,select,[contenteditable="true"],iframe');
        const range = element?.closest('input[type="range"]');
        const action = element?.closest<HTMLElement>('a,button:not(:disabled),summary,[role="tab"]');
        const nextWire = element?.closest<HTMLElement>('.wire') ?? null;
        if (wire !== nextWire) { clearWire(); wire = nextWire; }
        mode = native ? 'native' : range ? 'range' : action ? 'link' : wire ? 'wire' : 'idle';
        document.documentElement.classList.toggle('lab-cursor-active', visible && mode !== 'native');
        dot.dataset.mode = mode;
        ring.dataset.mode = mode;
        dot.dataset.visible = ring.dataset.visible = String(visible && mode !== 'native');
        ring.dataset.pressed = String(pressed);
        targetX = pointerX;
        targetY = pointerY;
        targetWidth = mode === 'wire' ? 54 : mode === 'range' ? 40 : 28;
        targetHeight = mode === 'range' ? 20 : targetWidth;
        if (action && mode === 'link') {
          const rect = action.getBoundingClientRect();
          // Large editorial links keep a local ring rather than covering the viewport.
          if (rect.width < 360 && rect.height < 100) {
            targetX = rect.left + rect.width / 2 + (pointerX - rect.left - rect.width / 2) * .08;
            targetY = rect.top + rect.height / 2 + (pointerY - rect.top - rect.height / 2) * .08;
            targetWidth = rect.width + 12;
            targetHeight = rect.height + 10;
          } else { targetWidth = targetHeight = 46; }
        }
        if (pressed) { targetWidth *= .88; targetHeight *= .88; }
        if (wire) {
          const rect = wire.getBoundingClientRect();
          const offset = Math.max(-1, Math.min(1, (pointerY-rect.top)/rect.height*2-1));
          wire.style.setProperty('--wire-shift', `${offset * 7}px`);
        }
        dot.style.transform = `translate3d(${pointerX - 2}px,${pointerY - 2}px,0)`;
        wake();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        pointerX = event.clientX; pointerY = event.clientY;
        visible = true;
        if (!initialized) { currentX = pointerX; currentY = pointerY; initialized = true; }
        update(event.target instanceof Element ? event.target : null);
      };
      const hide = () => {
        visible = false;
        pressed = false;
        initialized = false;
        document.documentElement.classList.remove('lab-cursor-active');
        dot.dataset.visible = ring.dataset.visible = 'false';
        cancelAnimationFrame(frame); frame = 0; lastTime = 0;
        clearWire();
      };
      const press = () => { pressed = true; update(document.elementFromPoint(pointerX, pointerY)); };
      const release = () => { pressed = false; if (visible) update(document.elementFromPoint(pointerX, pointerY)); };
      const scroll = () => { if (visible) update(document.elementFromPoint(pointerX, pointerY)); };
      const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') hide(); };
      const visibility = () => { if (document.hidden) hide(); };
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerdown', press);
      document.addEventListener('pointerup', release);
      document.addEventListener('pointercancel', hide);
      document.documentElement.addEventListener('pointerleave', hide);
      document.addEventListener('scroll', scroll, { passive: true, capture: true });
      document.addEventListener('keydown', keyboard);
      document.addEventListener('visibilitychange', visibility);
      window.addEventListener('blur', hide);
      window.addEventListener('resize', scroll);
      teardown = () => {
        hide();
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerdown', press);
        document.removeEventListener('pointerup', release);
        document.removeEventListener('pointercancel', hide);
        document.documentElement.removeEventListener('pointerleave', hide);
        document.removeEventListener('scroll', scroll, true);
        document.removeEventListener('keydown', keyboard);
        document.removeEventListener('visibilitychange', visibility);
        window.removeEventListener('blur', hide);
        window.removeEventListener('resize', scroll);
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => { preference.removeEventListener('change', setup); teardown(); };
  }, [pathname]);

  return <><div ref={dotRef} className="lab-cursor-dot" aria-hidden="true" /><div ref={ringRef} className="lab-cursor-ring" aria-hidden="true"><span /><span /></div></>;
}
