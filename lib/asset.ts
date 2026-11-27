/** A file in /public, prefixed with the base path when the site is served from a sub-folder (GitHub Pages). */
export function asset(path: string): string {
  return path.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}` : path;
}
