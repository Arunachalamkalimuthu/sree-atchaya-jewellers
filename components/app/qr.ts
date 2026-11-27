/** QR code as one SVG path, made on the server at build time (no "use client", qrcode stays out of the bundle). */
import QRCode from "qrcode";

/** `{ size, d }`: draw `d` in a `0 0 size size` viewBox, one 1×1 square per dark module. */
export function qrPath(text: string): { size: number; d: string } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size, data } = modules;
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size, d };
}
