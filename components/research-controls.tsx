"use client";

import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Measured selection geometry follows the BLANK tabs-subtle source recipe.
export function IntegrationTabs<T extends string>({
  options,
  value,
  onChange,
  panelId,
  label = "Agent integration",
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  panelId: string;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const container = root.current;
    const marker = indicator.current;
    if (!container || !marker) return;
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const position = () => {
          const active = container.querySelector<HTMLButtonElement>(
            '[aria-selected="true"]',
          );
          if (!active) return;
          gsap.to(marker, {
            x: active.offsetLeft,
            y: active.offsetTop - 4,
            width: active.offsetWidth,
            height: active.offsetHeight,
            duration:
              context.conditions?.reduced || !initialized.current ? 0 : 0.24,
            ease: "power3.out",
            overwrite: true,
          });
          initialized.current = true;
        };
        position();
        const observer = new ResizeObserver(position);
        observer.observe(container);
        container
          .querySelectorAll("button")
          .forEach((button) => observer.observe(button));
        return () => {
          observer.disconnect();
          gsap.killTweensOf(marker);
        };
      },
    );
    return () => media.revert();
  }, [value]);
  return (
    <div
      ref={root}
      className="integration-tabs"
      role="tablist"
      aria-label={label}
    >
      <span ref={indicator} className="tab-indicator" aria-hidden="true" />
      {options.map((option, index) => (
        <button
          key={option}
          role="tab"
          id={`${panelId}-tab-${index}`}
          aria-controls={panelId}
          aria-selected={value === option}
          tabIndex={value === option ? 0 : -1}
          onClick={() => onChange(option)}
          onKeyDown={(event) => {
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? options.length - 1
                  : event.key === "ArrowRight"
                    ? (index + 1) % options.length
                    : event.key === "ArrowLeft"
                      ? (index - 1 + options.length) % options.length
                      : undefined;
            if (next === undefined) return;
            event.preventDefault();
            const target = options[next];
            if (target === undefined) return;
            onChange(target);
            root.current
              ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
              [next]?.focus();
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function BudgetScrubber({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="budget-scrubber">
      <label htmlFor={id}>
        <span>Schema budget</span>
        <output htmlFor={id}>
          {value.toLocaleString()} <span>tokens</span>
        </output>
      </label>
      <div className="scrubber-track">
        <input
          id={id}
          type="range"
          min="0"
          max="25000"
          step="100"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuetext={`${value.toLocaleString()} schema tokens`}
        />
      </div>
      <div className="scrubber-scale" aria-hidden="true">
        <span>0</span>
        <span>12,500</span>
        <span>25,000</span>
      </div>
      <div className="budget-presets">
        <span>Inspect a budget</span>
        {[400, 18500, 25000].map((budget) => (
          <button
            key={budget}
            aria-pressed={value === budget}
            onClick={() => onChange(budget)}
          >
            {budget.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
