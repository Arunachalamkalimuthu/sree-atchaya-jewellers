/** Constants for the app surface. No "use client": the server layout reads them too. */
import { routes } from "@/lib/routes";

/** Where the demo is published (GitHub Pages). The QR always encodes this, even on localhost. */
export const PUBLIC_SITE_URL = "https://arunachalamkalimuthu.github.io/sree-atchaya-jewellers";
export const APP_PUBLIC_URL = `${PUBLIC_SITE_URL}${routes.app.home()}`;
