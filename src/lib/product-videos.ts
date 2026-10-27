/**
 * Short silent clips shown in a product's gallery next to its photos.
 *
 * Clips live in `public/videos` as 4:5 H.264 files under 1 MB, each with a
 * `.jpg` poster of the same name. They are listed here by product slug rather
 * than stored per colour, since one clip shows the product, not one variant.
 */
const VIDEOS: Record<string, string[]> = {
  "chanel-case": [1, 2, 3, 4, 5].map((n) => `/videos/chanel-${n}.mp4`),
  case: ["/videos/case18-1.mp4"],
};

export function productVideos(slug: string): string[] {
  return VIDEOS[slug] ?? [];
}

export function isVideo(url: string): boolean {
  return url.endsWith(".mp4");
}

export function posterOf(url: string): string {
  return url.replace(/\.mp4$/, ".jpg");
}
