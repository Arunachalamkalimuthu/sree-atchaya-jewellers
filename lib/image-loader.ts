// next/image loader for the static GitHub Pages build: there is no image optimizer, so files are
// served as they are, from the base path. (The width parameter is ignored by the host.)
import { asset } from "./asset";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  if (!src.startsWith("/")) return src; // data:, blob: and full URLs pass through
  return `${asset(src)}?w=${width}`;
}
