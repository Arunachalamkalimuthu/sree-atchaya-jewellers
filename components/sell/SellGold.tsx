"use client";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDemo } from "@/lib/use-demo";
import { useLang, useT, formatDate } from "@/lib/i18n";
import { sell } from "@/lib/i18n/dict/sell";
import { common } from "@/lib/i18n/dict/common";
import { PURCHASE_RATES, MARKET_SELL_25NOV, SITE } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import type { Appointment } from "@/lib/demo-state";
import { Button } from "@/components/ui/Button";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { Price } from "@/components/ui/Price";
import { OrnateFrame } from "@/components/brand/OrnateFrame";
import { Field, Segmented, inputCls } from "./form";

type Tab = "sell" | "release";
type Purity = "22K" | "18K";
type Lender = "bank" | "pawn";

const MARKET_DATE = "2026-11-25";
const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function SellGold() {
  return (
    <Suspense fallback={null}>
      <WithTab />
    </Suspense>
  );
}

function WithTab() {
  const p = useSearchParams().get("tab");
  const initial: Tab = p === "release" ? "release" : "sell";
  return <Page key={initial} initial={initial} />;
}

function Page({ initial }: { initial: Tab }) {
  const t = useT(sell);
  const [tab, setTab] = useState<Tab>(initial);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ sell: null, release: null });

  return (
    <>
      <section className="bg-emerald text-ivory">
        <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <h1 className="max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.1] text-ivory [text-wrap:balance] sm:text-5xl">{t("pageTitle")}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ivory/85">{t("pageIntro")}</p>
          <div role="tablist" aria-label={t("tabsLabel")} className="mt-9 flex gap-1">
            {(["sell", "release"] as const).map((id) => {
              const on = tab === id;
              return (
                <button
                  key={id} ref={(el) => { tabRefs.current[id] = el; }} type="button" role="tab" id={`tab-${id}`} aria-selected={on} aria-controls={`panel-${id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const next: Tab = id === "sell" ? "release" : "sell";
                      setTab(next);
                      tabRefs.current[next]?.focus();
                    }
                  }}
                  className={`min-h-12 rounded-t-[4px] px-5 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold sm:px-7 ${
                    on ? "bg-ivory text-maroon" : "bg-emerald-950/0 text-ivory/80 hover:bg-ivory/10"
                  }`}
                >
                  {id === "sell" ? t("tabSell") : t("tabRelease")}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {tab === "sell" ? (
          <div role="tabpanel" id="panel-sell" aria-labelledby="tab-sell"><SellPanel /></div>
        ) : (
          <div role="tabpanel" id="panel-release" aria-labelledby="tab-release"><ReleasePanel /></div>
        )}
      </div>
    </>
  );
}

function SellPanel() {
  const t = useT(sell);
  const tc = useT(common);
  const [lang] = useLang();
  const [weight, setWeight] = useState("10");
  const [purity, setPurity] = useState<Purity>("22K");

  const g = toNum(weight);
  const ok = Number.isFinite(g) && g > 0;
  const rate = purity === "22K" ? PURCHASE_RATES.g22 : PURCHASE_RATES.g18;
  const market = purity === "22K" ? MARKET_SELL_25NOV.g22 : MARKET_SELL_25NOV.g18;
  const estimate = ok ? Math.round(g * rate) : 0;
  const more = ok ? Math.round(g * (rate - market)) : 0;
  const marketDate = formatDate(MARKET_DATE, lang);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div>
          <h2 className="font-display text-3xl font-semibold text-maroon">{t("sellTitle")}</h2>
          <div className="mt-7 space-y-6">
            <Field label={t("sellWeight")} error={weight !== "" && !ok ? t("weightInvalid") : null}>
              {({ id, describedBy, invalid }) => (
                <input
                  id={id} type="number" inputMode="decimal" min="0" step="0.1" value={weight}
                  onChange={(e) => setWeight(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid}
                  className={`${inputCls} max-w-[12rem] num`}
                />
              )}
            </Field>
            <Segmented
              legend={t("sellPurity")} name="sell-purity" value={purity} onChange={setPurity}
              options={[{ value: "22K", label: t("sell22") }, { value: "18K", label: t("sell18") }]}
            />
          </div>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/80">{t("sellBring")}</p>
        </div>

        <OrnateFrame tone="emerald">
          <div aria-live="polite">
            <p className="text-sm text-ivory/80">{t("sellEstimate")}</p>
            <p className="mt-2" data-testid="sell-estimate">
              <Price value={estimate} size="xl" className="text-gold-light" />
            </p>
            <p className="mt-3 text-sm text-ivory/80">
              {t("sellRate")}: <span className="num whitespace-nowrap font-medium text-ivory">{formatINR(rate)}{tc("perGram")}</span>
            </p>
            <dl className="mt-6 border-t border-gold/40 pt-4 text-[15px]">
              <div className="flex items-baseline justify-between gap-4 py-1.5">
                <dt className="text-ivory/80">{t("sellMarketLabel", { date: marketDate })}</dt>
                <dd className="num whitespace-nowrap text-ivory">{formatINR(market)}{tc("perGram")}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-1.5">
                <dt className="font-medium text-gold-light">{t("sellMore")}</dt>
                <dd className="font-display text-2xl font-semibold text-gold-light num" data-testid="sell-more">
                  {t("sellMoreValue", { amount: formatINR(more) })}
                </dd>
              </div>
            </dl>
            <p className="mt-1 text-[13px] leading-snug text-ivory/70">{t("sellMoreNote", { grams: ok ? g : 0, date: marketDate })}</p>
            <p className="mt-5 text-[13px] leading-snug text-ivory/80">{t("sellEstimateNote")}</p>
          </div>
        </OrnateFrame>
      </div>

      <VisitForm kind="sell" extra={ok ? { grams: g, purity } : {}} canSubmit={ok} />
    </>
  );
}

function ReleasePanel() {
  const t = useT(sell);
  const [lender, setLender] = useState<Lender>("bank");
  const [lenderName, setLenderName] = useState("");
  const [loan, setLoan] = useState("150000");
  const [weight, setWeight] = useState("20");
  const [talk, setTalk] = useState(false);

  const g = toNum(weight);
  const l = toNum(loan);
  const gOk = Number.isFinite(g) && g > 0;
  const lOk = Number.isFinite(l) && l >= 0;
  const value = gOk ? Math.round(g * PURCHASE_RATES.g22) : 0;
  const surplus = value - (lOk ? l : 0);
  const short = gOk && lOk && surplus < 0;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div>
          <h2 className="font-display text-3xl font-semibold text-maroon">{t("releaseTitle")}</h2>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink/80">{t("releaseIntro")}</p>
          <div className="mt-7 space-y-6">
            <Segmented
              legend={t("releaseLender")} name="lender" value={lender} onChange={setLender}
              options={[{ value: "bank", label: t("lenderBank") }, { value: "pawn", label: t("lenderPawn") }]}
            />
            <Field label={t("lenderName")}>
              {({ id }) => (
                <input id={id} type="text" value={lenderName} onChange={(e) => setLenderName(e.target.value)}
                  placeholder={t("lenderNamePlaceholder")} className={inputCls} />
              )}
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={t("releaseLoan")} error={loan !== "" && !lOk ? t("loanInvalid") : null}>
                {({ id, describedBy, invalid }) => (
                  <input id={id} type="number" inputMode="numeric" min="0" step="1000" value={loan}
                    onChange={(e) => setLoan(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} num`} />
                )}
              </Field>
              <Field label={t("releaseWeight")} error={weight !== "" && !gOk ? t("weightInvalid") : null}>
                {({ id, describedBy, invalid }) => (
                  <input id={id} type="number" inputMode="decimal" min="0" step="0.1" value={weight}
                    onChange={(e) => setWeight(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} num`} />
                )}
              </Field>
            </div>
          </div>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/80">{t("releaseBring")}</p>
          <div className="mt-5">
            <Button variant="ghost" onClick={() => setTalk(true)}>{t("releaseTalk")}</Button>
          </div>
        </div>

        <div className="self-start bg-maroon p-7 text-ivory sm:p-9" aria-live="polite">
          <dl className="text-[15px]">
            <div className="flex items-baseline justify-between gap-4 border-b border-gold/30 py-2.5">
              <div>
                <dt className="text-ivory/85">{t("releaseValue")}</dt>
                <dd className="text-[13px] text-ivory/65">{t("releaseValueNote", { grams: gOk ? g : 0, rate: formatINR(PURCHASE_RATES.g22) })}</dd>
              </div>
              <dd className="num whitespace-nowrap text-lg text-ivory" data-testid="release-value">{formatINR(value)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-gold/30 py-2.5">
              <dt className="text-ivory/85">{t("releaseLoanLine")}</dt>
              <dd className="num whitespace-nowrap text-lg text-ivory">− {formatINR(lOk ? l : 0)}</dd>
            </div>
          </dl>
          {short ? (
            <div className="mt-6">
              <p className="font-display text-2xl font-semibold text-gold-light">{t("releaseShortAmount", { amount: formatINR(-surplus) })}</p>
              <p className="mt-2 text-[15px] leading-snug text-ivory/90" role="status">{t("releaseShort")}</p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-[15px] font-medium text-ivory">{t("releaseSurplus")}</p>
              <p className="mt-2" data-testid="release-surplus">
                <Price value={gOk && lOk ? surplus : 0} size="xl" className="text-gold-light" />
              </p>
            </div>
          )}
          <p className="mt-5 text-[13px] leading-snug text-ivory/75">{t("releaseSurplusNote")}</p>
        </div>
      </div>

      <VisitForm
        kind="release"
        extra={{
          ...(gOk ? { grams: g } : {}), purity: "22K",
          bank: lenderName.trim() || t(lender === "bank" ? "lenderBank" : "lenderPawn"),
          ...(lOk ? { loanAmount: l } : {}),
        }}
        canSubmit={gOk && lOk}
      />
      <ContactSheet open={talk} onClose={() => setTalk(false)} topic="goldRelease" />
    </>
  );
}

function VisitForm({ kind, extra, canSubmit }: { kind: "sell" | "release"; extra: Partial<Appointment>; canSubmit: boolean }) {
  const t = useT(sell);
  const [lang] = useLang();
  const { state, dispatch } = useDemo();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<Appointment | null>(null);

  const nameErr = !name.trim() ? t("nameRequired") : null;
  const phoneErr = !/^\d{10}$/.test(phone.replace(/\s/g, "")) ? t("phoneInvalid") : null;
  const dateErr = !date ? t("dateRequired") : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (nameErr || phoneErr || dateErr || !canSubmit) return;
    const appt: Omit<Appointment, "id"> = { kind, name: name.trim(), phone: `+91 ${phone.replace(/\s/g, "")}`, date, ...extra };
    dispatch({ type: "book", appt });
    setDone({ ...appt, id: `APT-${state.appointments.length + 1}` });
  };

  const rows: [string, string][] = done
    ? [
        [t("doneRef"), done.id],
        ...(done.grams ? [[t("doneGrams"), `${done.grams} g`] as [string, string]] : []),
        ...(done.purity ? [[t("donePurity"), done.purity] as [string, string]] : []),
        ...(kind === "release" && done.bank ? [[t("doneLender"), done.bank] as [string, string]] : []),
        ...(kind === "release" && done.loanAmount !== undefined ? [[t("doneLoan"), formatINR(done.loanAmount)] as [string, string]] : []),
      ]
    : [];

  return (
    <section className="mt-14 border-t border-gold/60 pt-10 lg:mt-20" aria-labelledby={`visit-${kind}`}>
      {done ? (
        <div className="max-w-2xl border border-emerald/60 bg-white p-7 sm:p-9" role="status" data-testid="booking-done">
          <h2 id={`visit-${kind}`} className="font-display text-3xl font-semibold text-emerald">{t("doneTitle")}</h2>
          <p className="mt-2 text-[16px] text-ink">{t("doneBody", { name: done.name, date: formatDate(done.date, lang) })}</p>
          <p className="mt-1 text-[14px] text-ink/70">{kind === "sell" ? t("doneKindSell") : t("doneKindRelease")}</p>
          <dl className="mt-5 text-[15px]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-gold/30 py-2">
                <dt className="text-ink/70">{k}</dt>
                <dd className="num text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-[13px] font-medium text-maroon">{t("doneDemo")}</p>
          <div className="mt-5"><Button variant="ghost" onClick={() => setDone(null)}>{t("doneAgain")}</Button></div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="max-w-2xl">
          <h2 id={`visit-${kind}`} className="font-display text-3xl font-semibold text-maroon">{t("formTitle")}</h2>
          <p className="mt-2 text-[15px] text-ink/75">{t("formIntro")}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label={t("formName")} error={tried ? nameErr : null}>
              {({ id, describedBy, invalid }) => (
                <input id={id} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
                  aria-describedby={describedBy} aria-invalid={invalid} className={inputCls} />
              )}
            </Field>
            <Field label={t("formPhone")} error={tried ? phoneErr : null}>
              {({ id, describedBy, invalid }) => (
                <input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" value={phone}
                  onChange={(e) => setPhone(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} num`} />
              )}
            </Field>
            <div className="sm:col-span-2 sm:max-w-xs">
              <Field label={t("formDate")} error={tried ? dateErr : null}>
                {({ id, describedBy, invalid }) => (
                  <input id={id} type="date" min={SITE.ratesDate} value={date} onChange={(e) => setDate(e.target.value)}
                    aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} num`} />
                )}
              </Field>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button type="submit" variant="maroon" size="lg">{t("formSubmit")}</Button>
            <p className="text-[13px] text-ink/65">{t("demoLine")}</p>
          </div>
        </form>
      )}
    </section>
  );
}
