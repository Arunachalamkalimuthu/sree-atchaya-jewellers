"use client";
import { useId, useState } from "react";
import { RATES, SCHEME } from "@/lib/site.config";
import { rupeesToGrams, digiBalance } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { PaymentSheet } from "@/components/ui/PaymentSheet";
import { Icon } from "@/components/ui/Icon";

const g4 = (g: number) => `${g.toFixed(4)} g`;
const PRESETS = [500, 1000, 5000];

/** `<DigiHoldings className?>`: grams held, their value at today's 24K rate, and the last few purchases. Reads the demo store. */
export function DigiHoldings({ className = "" }: { className?: string }) {
  const t = useT(scheme);
  const [lang] = useLang();
  const { state } = useDemo();
  const bal = digiBalance(state.digi);
  if (state.digi.txns.length === 0) return null;
  return (
    <div className={className}>
      <p className="text-[18px] font-semibold text-maroon" data-testid="digi-holding">
        {t("dgHolding", { g: g4(bal), value: formatINR(bal * RATES.g24) })}
      </p>
      <h4 className="mt-4 text-sm font-semibold text-ink">{t("dgHistory")}</h4>
      <ul className="mt-1 divide-y divide-line text-[13.5px] text-mute">
        {state.digi.txns.slice(-4).reverse().map((x, i) => (
          <li key={i} className="py-1.5">{t("dgHistoryRow", { date: formatDate(x.date, lang), g: g4(x.grams), amount: formatINR(x.rupees), rate: formatINR(x.rate) })}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * `<DigiBuy onDone? showHoldings? className?>`: buy Digi Gold by rupees or by grams with live conversion at RATES.g24,
 * then PaymentSheet, then buyDigi. `onDone` fires after the purchase is recorded. Self-contained (uses the demo store);
 * fits a 360 px phone frame. `showHoldings={false}` hides the "you hold" block.
 */
export function DigiBuy({ onDone, showHoldings = true, className = "" }: { onDone?: () => void; showHoldings?: boolean; className?: string }) {
  const t = useT(scheme);
  const id = useId();
  const { dispatch } = useDemo();
  const [mode, setMode] = useState<"rupees" | "grams">("rupees");
  const [raw, setRaw] = useState("1000");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState<{ g: number; rupees: number } | null>(null);

  const num = Number(raw);
  // Grams mode: pay the whole rupees that cover at least the grams asked for.
  const rupees = !raw || !Number.isFinite(num) ? 0 : mode === "rupees" ? Math.round(num) : Math.ceil(num * RATES.g24 - 1e-9);
  const grams = rupeesToGrams(rupees, RATES.g24);
  const valid = rupees >= SCHEME.digiMinRupees;

  const switchMode = (m: "rupees" | "grams") => {
    if (m === mode) return;
    setMode(m);
    setRaw(m === "grams" ? "0.1" : "1000");
    setDone(null);
  };

  return (
    <div className={`bg-white p-5 sm:p-6 ${className}`}>
      <h3 className="text-[20px] font-semibold text-ink">{t("dgTitle")}</h3>
      <p className="mt-1 text-[13px] text-mute">{t("dgRate", { rate: formatINR(RATES.g24) })}</p>

      <div role="group" aria-label={t("dgTitle")} className="mt-4 inline-flex overflow-hidden rounded-[4px] border border-line text-sm">
        {(["rupees", "grams"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => switchMode(m)}
            className={`min-h-10 px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${mode === m ? "bg-maroon text-white" : "text-maroon hover:bg-cream"}`}
          >
            {t(m === "rupees" ? "dgModeRupees" : "dgModeGrams")}
          </button>
        ))}
      </div>

      <label htmlFor={id} className="mt-4 block text-sm text-mute">{t(mode === "rupees" ? "dgRupees" : "dgGrams")}</label>
      <div className="mt-1 flex items-center rounded-[4px] border border-ink/20 bg-white focus-within:border-maroon focus-within:outline-2 focus-within:outline-gold">
        <span className="pl-3 text-lg text-mute">{mode === "rupees" ? "₹" : "g"}</span>
        <input
          id={id}
          inputMode="decimal"
          value={raw}
          onChange={(e) => { setRaw(e.target.value.replace(mode === "rupees" ? /\D/g : /[^\d.]/g, "").slice(0, 8)); setDone(null); }}
          className="num h-12 min-w-0 flex-1 bg-transparent px-2 text-[22px] font-semibold text-maroon outline-none"
          data-testid="digi-input"
        />
      </div>
      {mode === "rupees" && (
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => { setRaw(String(p)); setDone(null); }} className="num min-h-9 rounded-[4px] border border-line px-3 text-sm text-ink hover:border-maroon focus-visible:outline-2 focus-visible:outline-gold">
              {formatINR(p)}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4" aria-live="polite">
        {valid ? (
          <>
            <p className="num text-[24px] font-semibold text-maroon" data-testid="digi-grams">{t("dgGet", { g: g4(grams) })}</p>
            <p className="num text-sm text-mute" data-testid="digi-pay">{t("dgPay", { amount: formatINR(rupees) })}</p>
          </>
        ) : (
          <p className="text-sm text-maroon">{t("dgMin", { min: formatINR(SCHEME.digiMinRupees) })}</p>
        )}
      </div>

      {done && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-[4px] border border-line bg-cream px-3 py-2 text-sm text-ink" data-testid="digi-done">
          <Icon name="check" size={16} className="mt-0.5 shrink-0 text-maroon" /> <span>{t("dgDone", { g: g4(done.g), amount: formatINR(done.rupees) })}</span>
        </p>
      )}

      <Button variant="maroon" size="lg" full className="mt-4" disabled={!valid} onClick={() => setPaying(true)}>
        {t("dgBuy", { amount: formatINR(rupees) })}
      </Button>

      {showHoldings && <DigiHoldings className="mt-6 border-t border-line pt-4" />}

      <PaymentSheet
        open={paying}
        amount={rupees}
        note={t("dgNote")}
        onClose={() => setPaying(false)}
        onPaid={() => {
          dispatch({ type: "buyDigi", rupees });
          setDone({ g: grams, rupees });
          setPaying(false);
          onDone?.();
        }}
      />
    </div>
  );
}
