/**
 * A product description as the owner types it in the admin: a line or two of
 * pitch, then the selling points as lines that start with a tick or a dash.
 * Split so the page can show the points as a list a buyer reads at a glance,
 * instead of clamping them behind "more".
 */
const MARKER = /^\s*(?:✔️|✔|✅|☑️|✓|•|·|▪|-|–|\*)\s*/u;

export type DescriptionParts = { intro: string[]; points: string[] };

export function splitDescription(text: string): DescriptionParts {
  const intro: string[] = [];
  const points: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (MARKER.test(line)) points.push(line.replace(MARKER, "").trim());
    else intro.push(line);
  }
  return { intro, points: points.filter(Boolean) };
}
