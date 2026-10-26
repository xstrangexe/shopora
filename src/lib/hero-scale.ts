import type { CSSProperties } from "react";

/**
 * Sizes the home hero's design canvas (1172 x 620 design pixels) to the window.
 *
 * k = min(vw / W, vh / 560). Dividing the height by 560 rather than 620 fills
 * the width and lets the store preview bleed off the foot instead of
 * letterboxing. Between 1080 and 701px the design window W narrows from 1172
 * towards 920, continuously, so type stops shrinking with the viewport and k
 * does not jump at 1080; a portrait tablet tightens to 900 and reads larger.
 * At 700px and below the hero is a normal column and this does nothing.
 *
 * It runs twice: as an inline script right after the server-rendered section,
 * so the first paint is already scaled, and from the component on resize. So
 * it must stay self-contained: no imports, no outer variables.
 */
export function applyHeroScale(section: HTMLElement | null): void {
  if (!section) return;
  const canvas = section.querySelector<HTMLElement>(".hx-canvas");
  if (!canvas) return;
  const vw = section.clientWidth;
  if (vw <= 700) {
    section.style.removeProperty("height");
    canvas.style.removeProperty("--k");
    canvas.style.removeProperty("--fill");
    return;
  }
  // The header and announcement bar sit above the hero; it takes what is left.
  const top = Math.min(Math.max(0, section.getBoundingClientRect().top + window.scrollY), 120);
  const avail = Math.max(460, window.innerHeight - top);
  let w = 1172;
  if (vw <= 1080) {
    w = 920 + ((vw - 701) * (1172 - 920)) / (1080 - 701);
    if (avail > vw * 1.15) w = Math.min(w, 900);
  }
  const k = Math.min(vw / w, avail / 560);
  // Never taller than 700 design px: on a tall screen the shop shows below.
  const designH = Math.min(avail / k, 700);
  section.style.height = `${designH * k}px`;
  canvas.style.setProperty("--k", String(k));
  canvas.style.setProperty("--fill", `${Math.max(0, designH - 620)}px`);
}

/**
 * Entrance timing for one hero element: delay in ms, rise in px, optional
 * scale. The keyframes in styles.css read these variables.
 */
export function enter(delay: number, rise: number, scale?: number): CSSProperties {
  return {
    animationDelay: `${delay}ms`,
    "--hx-y": `${rise}px`,
    ...(scale ? { "--hx-s": String(scale) } : {}),
  } as CSSProperties;
}

/** The inline copy, run against the section just before the script tag. */
export const HERO_SCALE_SCRIPT = `(${applyHeroScale.toString()})(document.currentScript&&document.currentScript.previousElementSibling)`;
