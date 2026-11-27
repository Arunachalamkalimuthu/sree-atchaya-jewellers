"use client";
import { useId, useState, type FormEvent } from "react";
import { CONTEST, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { OrnateFrame } from "@/components/brand/OrnateFrame";
import { Button } from "@/components/ui/Button";
import { SectionHead } from "./SectionHead";

/** Grams in CONTEST.prize ("1 g gold coin"), so the prize can be said in Tamil too. */
const PRIZE_G = parseFloat(CONTEST.prize);

/** The two contests on plum, the colour their contest posts use: guess the necklace's weight, and the lucky draw. */
export function ContestCards() {
  const t = useT(home);
  return (
    <section aria-labelledby="contest-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <SectionHead id="contest-title" title={t("ctTitle")} />
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
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
    const g = Number(value.replace(",", "."));
    if (!value.trim() || !Number.isFinite(g) || g <= 0 || g > 10000) { setError(true); return; }
    setError(false);
    setSent(value.trim().replace(",", "."));
  };

  return (
    <OrnateFrame tone="plum" className="h-full">
      <h3 className="font-display text-[1.75rem] font-semibold leading-tight text-ivory sm:text-[2.1rem]">{t("wgTitle")}</h3>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ivory/80">{t("wgBody", { g: CONTEST.necklaceGrams })}</p>
      <p className="mt-2 font-display text-[1.2rem] font-semibold leading-snug text-gold-light num sm:text-[1.35rem]">{t("wgPrize", { n: CONTEST.winners, prize })}</p>

      {sent === null ? (
        <form onSubmit={submit} noValidate className="mt-6 max-w-md">
          <label htmlFor={inputId} className="text-[13.5px] text-ivory/70">{t("wgInput")}</label>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <input
              id={inputId}
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              aria-invalid={error || undefined}
              aria-describedby={error ? `${inputId}-err` : undefined}
              placeholder={CONTEST.necklaceGrams.toFixed(3)}
              className="min-h-11 w-40 rounded-[3px] border border-gold/55 bg-plum px-3 font-display text-[1.3rem] font-semibold text-ivory num placeholder:text-ivory/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
            <Button type="submit" variant="gold">{t("wgSubmit")}</Button>
          </div>
          {error && <p id={`${inputId}-err`} className="mt-2 text-[13.5px] text-gold-light">{t("wgInvalid", { eg: CONTEST.necklaceGrams.toFixed(3) })}</p>}
        </form>
      ) : (
        <div role="status" className="mt-6 max-w-md border-y border-gold/40 py-4">
          <p className="font-display text-[1.45rem] font-semibold text-ivory num">{t("wgDone", { g: sent })}</p>
          <p className="mt-1 text-[13.5px] text-ivory/70">{t("wgDemo")}</p>
        </div>
      )}
    </OrnateFrame>
  );
}

function LuckyDraw() {
  const t = useT(home);
  const [lang] = useLang();
  const d = SCHEME.luckyDraw;
  return (
    <OrnateFrame tone="plum" className="h-full">
      <div className="flex h-full flex-col">
        <h3 className="font-display text-[1.75rem] font-semibold leading-tight text-ivory">{t("ldTitle")}</h3>
        <p className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-[4.5rem] font-semibold leading-none text-gold-light num sm:text-[5.5rem]">{d.winners}</span>
          <span className="font-display text-[1.4rem] text-ivory/85">{t("ldPrizes")}</span>
        </p>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ivory/80">
          {t("ldBody", {
            amount: formatINR(d.joinAmount),
            from: formatDate(d.from, lang, { year: false }),
            to: formatDate(d.to, lang, { year: false }),
            n: d.winners,
          })}
        </p>
        <div className="mt-auto pt-6">
          <Button href={routes.scheme()} variant="gold">{t("ldCta")}</Button>
        </div>
      </div>
    </OrnateFrame>
  );
}
