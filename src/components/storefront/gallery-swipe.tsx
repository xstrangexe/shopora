import { useEffect, useRef } from "react";
import { isVideo, posterOf } from "@/lib/product-videos";
import { useI18n } from "@/lib/i18n-context";

/**
 * The gallery on a phone: one photo per screen, swiped sideways, with dots.
 *
 * It replaces the main frame plus thumbnail strip below 1024px. Swiping is what
 * a thumb does to a product photo, and dropping the strip brings the name and
 * the price into the first screen of an ad visitor's phone. The browser does the
 * scrolling (scroll snap), so there is no touch code to get wrong; this
 * component only keeps the page's active index and the scroll position agreed.
 */
export function GallerySwipe({
  images,
  alt,
  active,
  onSelect,
  onZoom,
}: {
  images: string[];
  alt: string;
  active: number;
  onSelect: (index: number) => void;
  onZoom: (index: number) => void;
}) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);

  const shown = () => {
    const el = track.current;
    return el && el.clientWidth > 0 ? Math.round(Math.abs(el.scrollLeft) / el.clientWidth) : 0;
  };

  // A colour pick or the lightbox moves the active photo: follow it. scrollLeft
  // runs negative in a right-to-left page, hence the sign.
  useEffect(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0 || shown() === active) return;
    const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollTo({ left: sign * active * el.clientWidth, behavior: "smooth" });
  }, [active]);

  // Only the clip on screen plays.
  useEffect(() => {
    track.current?.querySelectorAll("video").forEach((video) => {
      if (Number(video.dataset.index) === active) void video.play().catch(() => undefined);
      else video.pause();
    });
  }, [active]);

  return (
    <div className="gallery-swipe">
      <div
        ref={track}
        className="gallery-track"
        onScroll={() => {
          const index = shown();
          if (index !== active && index < images.length) onSelect(index);
        }}
      >
        {images.map((url, index) =>
          isVideo(url) ? (
            <div key={url} className="gallery-slide">
              <video
                data-index={index}
                src={url}
                poster={posterOf(url)}
                muted
                loop
                playsInline
                preload="none"
                aria-label={alt}
              />
            </div>
          ) : (
            <button
              key={url}
              type="button"
              className="gallery-slide cursor-zoom-in"
              onClick={() => onZoom(index)}
              aria-label={t("store.zoom")}
            >
              <img
                src={url}
                alt={index === 0 ? alt : ""}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </button>
          ),
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-dots" aria-hidden="true">
          {images.map((url, index) => (
            <span key={url} className={index === active ? "is-on" : ""} />
          ))}
        </div>
      )}
    </div>
  );
}
