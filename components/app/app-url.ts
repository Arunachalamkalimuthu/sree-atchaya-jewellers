/** Constants for the app surface. No "use client": the server layout reads them too. */
import { routes } from "@/lib/routes";

/** Where the demo is published (GitHub Pages). The QR always encodes this, even on localhost. */
export const PUBLIC_SITE_URL = "https://arunachalamkalimuthu.github.io/sree-atchaya-jewellers";
export const APP_PUBLIC_URL = `${PUBLIC_SITE_URL}${routes.app.home()}`;

/**
 * The simulated rate-alert push: "Gold dropped ₹40/g today". The ₹40 is demo copy from the brief, not a real
 * movement; it belongs in lib/site.config.ts when the controller consolidates shared values.
 */
export const RATE_ALERT_DROP_PER_G = 40;
