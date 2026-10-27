import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n-context";
import { posterOf, showcaseVideos } from "@/lib/product-videos";

/**
 * Full-height phone clips stacked below the order form, one under the other. Each plays
 * while at least 60% of it is on screen and pauses once it is not, so only one
 * or two decode at a time. Visitors who prefer reduced motion get a poster and
 * the native controls instead of autoplay.
 */
export function ProductShowcase({ slug }: { slug: string }) {
  const { t } = useI18n();
  const clips = showcaseVideos(slug);
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        }
      },
      { threshold: 0.6 },
    );
    el.querySelectorAll("video").forEach((video) => seen.observe(video));
    return () => seen.disconnect();
  }, [clips.length]);

  if (clips.length === 0) return null;

  return (
    <section className="flex flex-col gap-3" aria-label={t("store.showcase")}>
      <h2 className="font-display text-lg font-semibold">{t("store.showcase")}</h2>
      <div ref={row} className="showcase">
        {clips.map((src) => (
          <video
            key={src}
            src={src}
            poster={posterOf(src)}
            className="showcase-clip"
            muted
            loop
            playsInline
            controls
            controlsList="nodownload noremoteplayback"
            preload="none"
          />
        ))}
      </div>
    </section>
  );
}
