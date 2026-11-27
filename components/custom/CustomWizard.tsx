"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/use-demo";
import { useL10n, useT } from "@/lib/i18n";
import { custom } from "@/lib/i18n/dict/custom";
import { common } from "@/lib/i18n/dict/common";
import { CATEGORIES, type CategoryId, type Purity } from "@/lib/catalog";
import { priceBreakdown, formatINR } from "@/lib/pricing";
import { OFFER } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import type { CustomSpec } from "@/lib/demo-state";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OtpField } from "@/components/ui/OtpField";
import { PaymentSheet } from "@/components/ui/PaymentSheet";
import { PriceBreakdownTable } from "@/components/site/PriceBreakdownTable";
import { Field, Segmented, inputCls } from "@/components/sell/form";

const MAX_BYTES = 2 * 1024 * 1024;
const MIN_G = 2;
const MAX_G = 200;
const TOTAL = 4;
const TYPES: CategoryId[] = ["necklace", "haaram", "temple", "bangle", "chain", "earring", "ring", "silver", "diamond"];

/** Shrinks a chosen photo to a small JPEG dataURL so it fits in localStorage. Falls back to the original. */
function shrink(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const k = Math.min(1, 720 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k));
        c.height = Math.max(1, Math.round(img.height * k));
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      } catch { resolve(dataUrl); }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function CustomWizard() {
  const t = useT(custom);
  const tc = useT(common);
  const l10n = useL10n();
  const router = useRouter();
  const { state, dispatch } = useDemo();

  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoErr, setPhotoErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<CategoryId>("temple");
  const [purity, setPurity] = useState<Purity>("22K");
  const [weight, setWeight] = useState(30);
  const [weightText, setWeightText] = useState("30");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [detailsTried, setDetailsTried] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [codeAsked, setCodeAsked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyTried, setVerifyTried] = useState(false);
  const [paying, setPaying] = useState(false);

  const silver = type === "silver";
  const effPurity: Purity = silver ? "silver" : purity;
  const bd = priceBreakdown({ purity: effPurity, weightG: weight, category: type }, "prebook");
  const budgetNum = budget.trim() === "" ? undefined : Number(budget);
  const budgetErr = budgetNum !== undefined && (!Number.isFinite(budgetNum) || budgetNum < 0);
  const overBudget = budgetNum !== undefined && !budgetErr && budgetNum > 0 && bd.total > budgetNum;

  const nameErr = !name.trim();
  const cleanPhone = phone.replace(/\s/g, "");
  const phoneErr = !/^\d{10}$/.test(cleanPhone);

  const purityLabel = silver ? t("puritySilver") : purity === "22K" ? t("purity22") : purity === "18K" ? t("purity18") : t("purity24");

  const onFile = (file: File | undefined) => {
    setPhotoErr(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoErr(t("photoNotImage")); return; }
    if (file.size > MAX_BYTES) {
      setPhotoErr(t("photoTooBig", { mb: (file.size / 1024 / 1024).toFixed(1) }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const r = new FileReader();
    r.onerror = () => setPhotoErr(t("photoReadFail"));
    r.onload = async () => setPhoto(await shrink(String(r.result)));
    r.readAsDataURL(file);
  };

  const setWeightBoth = (n: number) => { setWeight(n); setWeightText(String(n)); };
  const onWeightText = (s: string) => {
    setWeightText(s);
    const n = Number(s);
    if (s.trim() !== "" && Number.isFinite(n) && n >= MIN_G && n <= MAX_G) setWeight(n);
  };
  const weightTextOk = (() => { const n = Number(weightText); return weightText.trim() !== "" && Number.isFinite(n) && n >= MIN_G && n <= MAX_G; })();

  const goDetailsNext = () => {
    setDetailsTried(true);
    if (!weightTextOk || budgetErr) return;
    setStep(3);
  };

  const onPaid = (method: "upi" | "card" | "netbanking") => {
    const spec: CustomSpec = {
      type, purity: effPurity, approxWeightG: weight,
      ...(budgetNum !== undefined && !budgetErr ? { budget: budgetNum } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      ...(photo ? { refImage: photo } : {}),
    };
    const id = `SAJ-${state.nextId}`;
    dispatch({
      type: "placeOrder",
      order: { kind: "custom", lines: [], custom: spec, fulfilment: "pickup", total: bd.total, advancePaid: bd.advance, payMethod: method },
    });
    setPaying(false);
    router.push(routes.order(id));
  };

  const stepNames = [t("stepPhoto"), t("stepDetails"), t("stepQuote"), t("stepPay")];

  return (
    <>
      <section className="bg-maroon text-ivory">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.1] sm:text-5xl">{t("pageTitle")}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ivory/85">
            {t("pageIntro", { off: OFFER.prebookOffPerGram, pct: OFFER.prebookAdvancePct })}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ol aria-label={t("stepsLabel")} className="mb-9 flex gap-2 border-b border-gold/60 pb-4 sm:gap-6">
          {stepNames.map((n, i) => {
            const k = i + 1;
            const cur = k === step;
            return (
              <li key={n} aria-current={cur ? "step" : undefined} className={`flex min-w-0 items-center gap-2.5 ${cur ? "flex-1" : "shrink-0 sm:flex-1"} ${cur ? "text-maroon" : k < step ? "text-emerald" : "text-ink/45"}`}>
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[13px] font-medium num ${cur ? "border-maroon bg-maroon text-ivory" : k < step ? "border-emerald bg-emerald text-ivory" : "border-current"}`}>
                  {k < step ? <Icon name="check" size={14} /> : k}
                </span>
                <span className={`min-w-0 truncate text-sm font-medium ${cur ? "" : "hidden sm:inline"}`}>{n}</span>
              </li>
            );
          })}
        </ol>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div>
            <p className="mb-2 text-sm text-ink/65 sm:hidden">{t("stepOf", { n: step, total: TOTAL })}</p>

            {step === 1 && (
              <section aria-labelledby="s1">
                <h2 id="s1" className="font-display text-3xl font-semibold text-maroon">{t("photoTitle")}</h2>
                <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink/80">{t("photoHelp")}</p>
                <input
                  ref={fileRef} id="ref-photo" type="file" accept="image/*" className="sr-only"
                  onChange={(e) => onFile(e.target.files?.[0])} aria-describedby={photoErr ? "photo-err" : undefined}
                />
                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex aspect-[4/5] w-44 shrink-0 items-center justify-center overflow-hidden rounded-t-[88px] border border-gold bg-maroon/5">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={t("photoAlt")} className="size-full object-cover" data-testid="ref-preview" />
                    ) : (
                      <p className="px-4 text-center text-[13px] text-ink/55">{t("photoEmpty")}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <label htmlFor="ref-photo" className="inline-flex min-h-11 cursor-pointer items-center rounded-[3px] bg-maroon px-5 text-sm font-medium text-ivory hover:bg-maroon-deep has-[:focus-visible]:outline-2">
                      {photo ? t("photoChange") : t("photoChoose")}
                    </label>
                    {photo && (
                      <Button variant="ghost" size="sm" onClick={() => { setPhoto(null); setPhotoErr(null); if (fileRef.current) fileRef.current.value = ""; }}>
                        {t("photoRemove")}
                      </Button>
                    )}
                    {photoErr && <p id="photo-err" role="alert" className="max-w-sm text-sm font-medium text-maroon">{photoErr}</p>}
                    <p className="max-w-sm text-[13px] leading-snug text-ink/65">{t("photoNote")}</p>
                  </div>
                </div>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Button variant="maroon" size="lg" onClick={() => setStep(2)}>{t("next")}</Button>
                  {!photo && <button type="button" onClick={() => setStep(2)} className="text-sm text-maroon underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">{t("photoSkip")}</button>}
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="s2">
                <h2 id="s2" className="font-display text-3xl font-semibold text-maroon">{t("detailsTitle")}</h2>
                <div className="mt-6 max-w-xl space-y-6">
                  <Field label={t("typeLabel")}>
                    {({ id }) => (
                      <select id={id} value={type} onChange={(e) => { setType(e.target.value as CategoryId); if (e.target.value === "diamond") setPurity("18K"); }} className={inputCls}>
                        {TYPES.map((c) => <option key={c} value={c}>{l10n(CATEGORIES.find((x) => x.id === c)!)}</option>)}
                      </select>
                    )}
                  </Field>
                  {!silver && (
                    <Segmented
                      legend={t("purityLabel")} name="purity" value={purity} onChange={setPurity}
                      options={[{ value: "22K", label: t("purity22") }, { value: "18K", label: t("purity18") }, { value: "24K", label: t("purity24") }]}
                    />
                  )}
                  <div>
                    <Field label={t("weightLabel")} hint={t("weightHint")} error={detailsTried && !weightTextOk ? t("weightHint") : null}>
                      {({ id, describedBy, invalid }) => (
                        <div className="flex items-center gap-4">
                          <input
                            type="range" min={MIN_G} max={MAX_G} step={1} value={weight}
                            onChange={(e) => setWeightBoth(Number(e.target.value))}
                            aria-label={t("weightSlider")} className="h-11 min-w-0 flex-1 accent-maroon"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              id={id} type="number" inputMode="decimal" min={MIN_G} max={MAX_G} step={1} value={weightText}
                              onChange={(e) => onWeightText(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid}
                              className={`${inputCls} w-24 num`}
                            />
                            <span className="text-sm text-ink/70">{t("weightUnit")}</span>
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                  <Field label={t("budgetLabel")} hint={t("budgetHint")} error={budgetErr ? t("budgetInvalid") : null}>
                    {({ id, describedBy, invalid }) => (
                      <input id={id} type="number" inputMode="numeric" min="0" step="1000" value={budget}
                        onChange={(e) => setBudget(e.target.value)} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} max-w-[14rem] num`} />
                    )}
                  </Field>
                  <Field label={t("notesLabel")}>
                    {({ id }) => (
                      <textarea id={id} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPlaceholder")} className={inputCls} />
                    )}
                  </Field>
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button variant="ghost" size="lg" onClick={() => setStep(1)}>{t("back")}</Button>
                  <Button variant="maroon" size="lg" onClick={goDetailsNext}>{t("seeQuote")}</Button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="s3">
                <h2 id="s3" className="font-display text-3xl font-semibold text-maroon">{t("quoteTitle")}</h2>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/75">{t("quoteBasis", { g: weight, purity: purityLabel })}</p>
                <p className="mt-4 inline-block bg-emerald px-3 py-1.5 text-sm font-medium text-ivory" data-testid="quote-off">
                  {t("quoteOffApplied", { off: OFFER.prebookOffPerGram })}
                </p>
                <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12">
                  <PriceBreakdownTable breakdown={bd} mode="prebook" purity={effPurity} />
                  <div className="self-start">
                    <dl className="text-[15px]">
                      {[
                        [t("quoteSummaryType"), l10n(CATEGORIES.find((x) => x.id === type)!)],
                        [t("quoteSummaryPurity"), purityLabel],
                        [t("quoteSummaryWeight"), tc("weightG", { g: weight })],
                        ...(budgetNum !== undefined && !budgetErr ? [[t("quoteSummaryBudget"), formatINR(budgetNum)]] : []),
                        [photo ? t("quotePhotoYes") : t("quotePhotoNo"), ""],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 border-b border-gold/30 py-2">
                          <dt className="text-ink/70">{k}</dt><dd className="text-right text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-5 bg-maroon p-5 text-ivory">
                      <p className="text-sm text-ivory/85">{t("quoteAdvanceHead")}</p>
                      <p className="mt-1 font-display text-4xl font-semibold text-gold-light num" data-testid="quote-advance">{formatINR(bd.advance)}</p>
                      <p className="mt-2 text-[13px] leading-snug text-ivory/80">{t("quoteAdvanceNote", { pct: OFFER.prebookAdvancePct })}</p>
                    </div>
                    {overBudget && <p role="status" className="mt-4 text-sm font-medium text-maroon">{t("quoteOverBudget")}</p>}
                  </div>
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button variant="ghost" size="lg" onClick={() => setStep(2)}>{t("back")}</Button>
                  <Button variant="maroon" size="lg" onClick={() => setStep(4)}>{t("next")}</Button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="s4">
                <h2 id="s4" className="font-display text-3xl font-semibold text-maroon">{t("verifyTitle")}</h2>
                <div className="mt-6 max-w-md space-y-5">
                  <Field label={t("nameLabel")} error={verifyTried && nameErr ? t("nameRequired") : null}>
                    {({ id, describedBy, invalid }) => (
                      <input id={id} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
                        aria-describedby={describedBy} aria-invalid={invalid} className={inputCls} />
                    )}
                  </Field>
                  <Field label={t("phoneLabel")} hint={t("phoneHelp")} error={verifyTried && phoneErr ? t("phoneInvalid") : null}>
                    {({ id, describedBy, invalid }) => (
                      <input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" value={phone}
                        onChange={(e) => { setPhone(e.target.value); setCodeAsked(false); setVerified(false); }}
                        aria-describedby={describedBy} aria-invalid={invalid} className={`${inputCls} num`} />
                    )}
                  </Field>
                  {!codeAsked && (
                    <Button variant="gold" onClick={() => { setVerifyTried(true); if (!nameErr && !phoneErr) setCodeAsked(true); }}>{t("sendCode")}</Button>
                  )}
                  {codeAsked && <OtpField phone={`+91 ${cleanPhone}`} onVerified={() => setVerified(true)} />}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button variant="ghost" size="lg" onClick={() => setStep(3)}>{t("back")}</Button>
                  <Button variant="maroon" size="lg" disabled={!verified} onClick={() => setPaying(true)}>
                    {t("payAdvance", { amount: formatINR(bd.advance) })}
                  </Button>
                  {!verified && <p className="text-[13px] text-ink/65">{t("payFirst")}</p>}
                </div>
                <p className="mt-4 text-[13px] text-ink/65">{t("demoLine")}</p>
              </section>
            )}
          </div>

          <aside className="self-start border-t-2 border-gold pt-5 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold text-maroon">{t("asideTitle")}</h2>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-snug text-ink/80">
              <li>{t("aside1")}</li>
              <li>{t("aside2")}</li>
              <li>{t("aside3")}</li>
            </ul>
          </aside>
        </div>
      </div>

      <PaymentSheet open={paying} amount={bd.advance} onPaid={onPaid} onClose={() => setPaying(false)} note={t("payNote")} />
    </>
  );
}
