import type { CSSProperties } from "react";

/**
 * Sizes the home hero's design canvas (1172 x 700 design pixels) to the window.
 *
 * k = min(vw / W, vh / 700): the whole canvas fits the screen under the header,
 * so the ring's cards show whole rather than cut at the foot. Between 1080 and
 * 701px the design window W narrows from 1172
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
  const k = Math.min(vw / w, avail / 700);
  // Exactly the canvas: on a tall screen the shop shows below, not empty black.
  section.style.height = `${700 * k}px`;
  canvas.style.setProperty("--k", String(k));
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
