import type { CategoryId } from "@/lib/catalog";

/** Point on a cubic Bézier, for placing beads along a drawn curve. */
function bez(t: number, p: [number, number][]): [number, number] {
  const u = 1 - t;
  const x = u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0];
  const y = u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1];
  return [x, y];
}

const NECK: [number, number][] = [[62, 28], [70, 128], [230, 128], [238, 28]];
const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * `<DesignSketch kind notes={[...]} />`: the designer's order-book drawing of the piece, a fine maroon pencil line on
 * squared paper, with two handwritten-style notes (purity, approximate weight) on leader lines. Decorative SVG:
 * the caller gives it an accessible name.
 */
export function DesignSketch({ kind, notes, className = "" }: { kind: CategoryId; notes: [string, string]; className?: string }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let piece: React.ReactNode;

  switch (kind) {
    case "bangle":
      piece = (
        <g {...line}>
          <ellipse cx="150" cy="96" rx="92" ry="36" />
          <ellipse cx="150" cy="96" rx="76" ry="26" />
          <ellipse cx="150" cy="112" rx="92" ry="36" opacity=".55" />
          {Array.from({ length: 13 }, (_, i) => {
            const a = Math.PI * (0.08 + (i * 0.84) / 12);
            const x = 150 - Math.cos(a) * 84, y = 96 + Math.sin(a) * 31;
            return <circle key={i} cx={r1(x)} cy={r1(y)} r="2.6" />;
          })}
        </g>
      );
      break;
    case "ring":
      piece = (
        <g {...line}>
          <circle cx="150" cy="118" r="46" />
          <circle cx="150" cy="118" r="38" />
          <path d="M150 50l15 16-15 16-15-16z" />
          <path d="M150 58l7 8-7 8-7-8z" />
          <path d="M128 76c6 4 14 6 22 6s16-2 22-6" />
        </g>
      );
      break;
    case "earring":
      piece = (
        <g {...line}>
          <circle cx="150" cy="34" r="11" />
          <circle cx="150" cy="34" r="5" />
          <path d="M150 45v14" />
          <path d="M112 118c0-34 17-56 38-56s38 22 38 56z" />
          <path d="M122 104c8-4 18-6 28-6s20 2 28 6" />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={116 + i * 8.5} cy="128" r="3" />)}
        </g>
      );
      break;
    case "chain":
      piece = (
        <g {...line}>
          {Array.from({ length: 19 }, (_, i) => {
            const [x, y] = bez(0.03 + (i * 0.94) / 18, NECK);
            return <ellipse key={i} cx={r1(x)} cy={r1(y)} rx="6" ry="3.6" transform={`rotate(${i % 2 ? 50 : -30} ${r1(x)} ${r1(y)})`} />;
          })}
        </g>
      );
      break;
    case "coin":
      piece = (
        <g {...line}>
          <circle cx="150" cy="96" r="62" />
          <circle cx="150" cy="96" r="52" />
          <path d="M150 64l26 32-26 32-26-32z" />
          <path d="M150 80l12 16-12 16-12-16z" />
        </g>
      );
      break;
    case "silver":
      piece = (
        <g {...line}>
          <path d="M150 34c6 8 8 13 8 17a8 8 0 01-16 0c0-4 2-9 8-17z" />
          <path d="M108 70h84l-10 14h-64z" />
          <path d="M146 84v62M154 84v62" />
          <path d="M140 104h20M140 126h20" />
          <ellipse cx="150" cy="158" rx="40" ry="10" />
        </g>
      );
      break;
    default: {
      // Necklace, haaram, temple set, diamond pendant: the neckline, mango motifs along it and a pendant.
      const drops = Array.from({ length: 11 }, (_, i) => bez(0.12 + (i * 0.76) / 10, NECK));
      piece = (
        <g {...line}>
          <path d={`M${NECK[0].join(" ")}C${NECK.slice(1).map((p) => p.join(" ")).join(" ")}`} />
          <path d="M80 28C88 110 212 110 220 28" opacity=".6" />
          {drops.map(([x, y], i) => (
            <path key={i} d={`M${r1(x)} ${r1(y)}c-4 4-4 10 0 12 4-2 4-8 0-12z`} />
          ))}
          <path d="M150 104l-15 18 15 28 15-28z" />
          <circle cx="150" cy="126" r="5.5" />
          {kind === "temple" && <path d="M138 104c4-7 20-7 24 0" />}
        </g>
      );
    }
  }

  return (
    <svg viewBox="0 0 300 190" className={className} aria-hidden="true">
      <defs>
        <pattern id="sa-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="#6e1517" strokeOpacity=".09" strokeWidth=".6" />
        </pattern>
      </defs>
      <rect width="300" height="190" fill="url(#sa-grid)" />
      <g className="text-maroon-deep">{piece}</g>
      <g fill="none" stroke="#c9a24a" strokeWidth=".9" strokeDasharray="2 2.5">
        <path d="M168 132L232 156" />
        <path d="M232 36L262 22" />
      </g>
      <g className="fill-maroon font-display" fontStyle="italic" fontSize="13">
        <text x="236" y="162">{notes[0]}</text>
        <text x="206" y="16">{notes[1]}</text>
      </g>
    </svg>
  );
}
