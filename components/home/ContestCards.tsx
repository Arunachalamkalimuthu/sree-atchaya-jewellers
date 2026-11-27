"use client";
import { useId, useState, type FormEvent } from "react";
import { CONTEST, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "./SectionHead";

/** Grams in CONTEST.prize ("1 g gold coin"), so the prize can be said in Tamil too. */
const PRIZE_G = parseFloat(CONTEST.prize);
/** A neutral example guess: the necklace's real weight is the answer, so it never appears on the page. */
const EXAMPLE_GUESS = "150.250";
/** Plain grams: up to 4 whole digits, optionally up to 3 decimals (milligrams). Rejects "1e3", "0x10", "12.", "-5". */
const GRAMS = /^\d{1,4}(?:[.,]\d{1,3})?$/;

/** The two contests as plain white cards with a fine border: guess the necklace's weight, and the lucky draw. */
export function ContestCards() {
  const t = useT(home);
  return (
    <section aria-labelledby="contest-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHead id="contest-title" title={t("ctTitle")} />
      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <WeightGuess />
        <LuckyDraw />
      </div>
    </section>
  );
}

function WeightGuess() {
  const t = useT(home);
  const inputId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const prize = t("prize", { g: PRIZE_G });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    const g = GRAMS.test(raw) ? Number(raw.replace(",", ".")) : NaN;
    if (!(g > 0)) { setError(true); return; }
    setError(false);
    setSent(g.toFixed(3));
  };

  return (
    <div className="h-full rounded-[6px] border border-line bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h3 className="text-[20px] font-semibold leading-tight text-ink">{t("wgTitle")}</h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-mute">{t("wgBody")}</p>
      <p className="mt-1 text-[15px] font-semibold text-maroon tabular-nums">{t("wgPrize", { n: CONTEST.winners, prize })}</p>

      {sent === null ? (
        <form onSubmit={submit} noValidate className="mt-6 max-w-md">
          <label htmlFor={inputId} className="text-[13.5px] text-mute">{t("wgInput")}</label>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <input
              id={inputId}
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              aria-invalid={error || undefined}
              aria-describedby={error ? `${inputId}-err` : undefined}
              placeholder={t("wgPlaceholder", { eg: EXAMPLE_GUESS })}
              className="min-h-11 w-40 rounded-[4px] border border-line bg-white px-3 text-[17px] font-semibold text-ink tabular-nums placeholder:font-normal placeholder:text-mute/60 focus-visible:border-maroon/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold aria-[invalid=true]:border-maroon"
            />
            <Button type="submit" variant="maroon">{t("wgSubmit")}</Button>
          </div>
          {error && <p id={`${inputId}-err`} className="mt-2 text-[13.5px] text-maroon">{t("wgInvalid", { eg: EXAMPLE_GUESS })}</p>}
        </form>
      ) : (
        <div role="status" className="mt-6 max-w-md border-y border-line py-4">
          <p className="text-[18px] font-semibold text-ink tabular-nums">{t("wgDone", { g: sent })}</p>
          <p className="mt-1 text-[13.5px] text-mute">{t("wgDemo")}</p>
        </div>
      )}
    </div>
  );
}

function LuckyDraw() {
  const t = useT(home);
  const [lang] = useLang();
  const d = SCHEME.luckyDraw;
  return (
    <div className="h-full rounded-[6px] border border-line bg-white px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex h-full flex-col">
        <h3 className="text-[20px] font-semibold leading-tight text-ink">{t("ldTitle")}</h3>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-[36px] font-semibold leading-none text-maroon tabular-nums">{d.winners}</span>
          <span className="text-[16px] font-medium text-ink">{t("ldPrizes")}</span>
        </p>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mute">
          {t("ldBody", {
            amount: formatINR(d.joinAmount),
            from: formatDate(d.from, lang, { year: false }),
            to: formatDate(d.to, lang, { year: false }),
            n: d.winners,
          })}
        </p>
        <div className="mt-auto pt-6">
          <Button href={routes.scheme()} variant="ghost">{t("ldCta")}</Button>
        </div>
      </div>
    </div>
  );
}
