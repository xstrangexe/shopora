import { useEffect, useRef } from "react";
import { enter } from "@/lib/hero-scale";

/**
 * The shop's own phone-case pictures, cut from its photos, ad creatives and
 * videos (public/hero). "tall" are 9:16 and fill the card; "ad" are the 4:5
 * creatives, shown whole over a blurred copy so no text is cropped. Every
 * price shown on an ad matches the catalogue (Chanel 4 400, 18 Pro Max 2 900).
 */
const SHOTS: { src: string; kind: "tall" | "ad" }[] = [
  "ad",
  "tall",
  "tall",
  "ad",
  "tall",
  "ad",
  "tall",
  "tall",
  "tall",
  "tall",
  "tall",
  "ad",
  "tall",
  "ad",
  "tall",
  "tall",
  "ad",
  "ad",
  "tall",
  "ad",
  "tall",
  "ad",
  "ad",
  "tall",
].map((kind, i) => ({
  src: `/hero/h${String(i + 1).padStart(2, "0")}.webp`,
  kind: kind as "tall" | "ad",
}));

// The ring: 37 cards on a cylinder of radius R, the camera at its centre
// (perspective = R), so each card is tangent to the cylinder and faces the
// camera. Cards more than 42 degrees round are behind the preview and culled.
const R = 891;
const COUNT = 37;
const STEP = 360 / COUNT;
const CULL = 42;
const SPEED = 1.9; // degrees per second

function place(cards: (HTMLDivElement | null)[], phase: number) {
  cards.forEach((card, i) => {
    if (!card) return;
    const a = ((((i * STEP + phase) % 360) + 540) % 360) - 180; // signed, -180..180
    if (Math.abs(a) > CULL) {
      card.style.visibility = "hidden";
      return;
    }
    const r = (a * Math.PI) / 180;
    const c = Math.cos(r);
    card.style.visibility = "visible";
    card.style.transform = `translate3d(${R * Math.sin(r)}px,0,${R * (1 - c)}px) rotateY(${-a}deg)`;
    // Edges dim, the front card is brightest.
    card.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`;
  });
}

export function HeroRing() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let phase = -2;
    let last = 0;
    let frame = 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      if (!still.matches) phase -= SPEED * dt;
      place(cards.current, phase);
      frame = requestAnimationFrame(tick);
    };
    // A tab brought back from the background must not jump.
    const onVisible = () => {
      last = 0;
    };
    document.addEventListener("visibilitychange", onVisible);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className="hx-ring hx-a" style={enter(700, 18, 0.99)} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const shot = SHOTS[i % SHOTS.length];
        const broken = (e: React.SyntheticEvent<HTMLImageElement>) =>
          e.currentTarget.parentElement?.classList.add("broken");
        return (
          <div
            key={i}
            className="hx-card"
            ref={(el) => {
              cards.current[i] = el;
            }}
          >
            {shot.kind === "ad" && (
              <img src={shot.src} alt="" className="hx-ad-bg" decoding="async" onError={broken} />
            )}
            <img
              src={shot.src}
              alt=""
              className={shot.kind === "ad" ? "hx-ad" : undefined}
              decoding="async"
              onError={broken}
            />
            <div className="hx-card-edge" />
          </div>
        );
      })}
    </div>
  );
}
