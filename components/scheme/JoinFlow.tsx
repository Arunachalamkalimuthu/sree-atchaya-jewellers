"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SCHEME } from "@/lib/site.config";
import { isValidMonthly } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { OtpField } from "@/components/ui/OtpField";
import { PaymentSheet } from "@/components/ui/PaymentSheet";
import { Icon } from "@/components/ui/Icon";
import { PlanCalculator } from "./PlanCalculator";
import { Passbook } from "./Passbook";
import { DigiBuy, DigiHoldings } from "./DigiBuy";

const RELATIONS = ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"] as const;
const field = "mt-1 h-12 w-full rounded-[4px] border border-ink/20 bg-white px-3 text-[16px] text-ink focus-visible:border-maroon focus-visible:outline-2 focus-visible:outline-gold read-only:bg-cream";

type Step = "details" | "amount" | "done";

/** The join flow: details and OTP, amount, payment, then the success screen with the passbook. Reads ?plan= and ?amount=. */
export function JoinFlow() {
  const t = useT(scheme);
  const params = useSearchParams();
  const { state, dispatch } = useDemo();
  const [plan, setPlan] = useState<"monthly" | "digi">(params.get("plan") === "digi" ? "digi" : "monthly");
  const startAmount = Number(params.get("amount"));

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState(state.user?.name ?? "");
  const [phone, setPhone] = useState((state.user?.phone ?? "").replace(/\D/g, "").slice(-10));
  const [nominee, setNominee] = useState("");
  const [relation, setRelation] = useState("");
  const [verified, setVerified] = useState(false);
  const [monthly, setMonthly] = useState(isValidMonthly(startAmount) ? startAmount : 5000);
  const [paying, setPaying] = useState(false);
  const [newPlanId, setNewPlanId] = useState<string | null>(null);

  const phoneOk = /^\d{10}$/.test(phone);
  const detailsOk = name.trim().length > 1 && verified && nominee.trim().length > 1 && relation !== "";
  const newPlan = state.plans.find((p) => p.id === newPlanId);

  const goAmount = () => {
    if (!state.user) dispatch({ type: "signIn", name: name.trim(), phone: `+91 ${phone}` });
    setStep("amount");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">{t(plan === "monthly" ? "jnMonthly" : "jnDigi")}</h1>
      {step !== "done" && (
        <>
          <p className="mt-2 text-sm text-mute">{t("jnStep", { n: step === "details" ? 1 : 2, total: 2 })}</p>
          <ol className="mt-4 flex gap-6 border-b border-line pb-4">
            {(["details", "amount"] as const).map((k, i) => {
              const cur = k === step;
              const past = step === "amount" && k === "details";
              return (
                <li key={k} aria-current={cur ? "step" : undefined} className={`flex items-center gap-2.5 ${cur ? "text-maroon" : past ? "text-ink" : "text-mute"}`}>
                  <span className={`num flex size-7 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold ${cur ? "border-maroon bg-maroon text-white" : past ? "border-maroon text-maroon" : "border-current"}`}>
                    {past ? <Icon name="check" size={14} /> : i + 1}
                  </span>
                  <span className="text-sm font-semibold">{t(k === "details" ? "jnDetails" : "jnAmount")}</span>
                </li>
              );
            })}
          </ol>
        </>
      )}
      {step === "done" && <div className="mt-3 h-px bg-line" />}

      {step === "details" && (
        <form
          className="mt-8"
          onSubmit={(e) => { e.preventDefault(); if (detailsOk) goAmount(); }}
        >
          <h2 className="text-[20px] font-semibold text-ink">{t("jnDetails")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-mute">
              {t("jnName")}
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </label>
            <label className="block text-sm text-mute">
              {t("jnPhone")} <span className="text-mute">({t("jnPhoneHint")})</span>
              <input
                className={field}
                value={phone}
                readOnly={verified}
                inputMode="numeric"
                autoComplete="tel-national"
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </label>
          </div>

          <div className="mt-5">
            {phoneOk ? (
              <OtpField phone={`+91 ${phone}`} onVerified={() => setVerified(true)} />
            ) : (
              <p className="text-sm text-mute">{t("jnVerifyFirst")}</p>
            )}
          </div>

          <h2 className="mt-8 text-[20px] font-semibold text-ink">{t("jnNominee")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-mute">
              {t("jnNomineeName")}
              <input className={field} value={nominee} onChange={(e) => setNominee(e.target.value)} required />
            </label>
            <label className="block text-sm text-mute">
              {t("jnRelation")}
              <select className={field} value={relation} onChange={(e) => setRelation(e.target.value)} required>
                <option value="">{t("jnRelPick")}</option>
                {RELATIONS.map((r) => <option key={r} value={r}>{t(`rel${r}` as "relSpouse")}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button type="submit" variant="maroon" size="lg" disabled={!detailsOk}>{t("jnContinue")}</Button>
            <Button variant="ghost" onClick={() => setPlan(plan === "monthly" ? "digi" : "monthly")}>{t("jnSwitch")}</Button>
          </div>
          <p className="mt-4 text-xs text-mute">{t("jnDemo")}</p>
        </form>
      )}

      {step === "amount" && (
        <div className="mt-8">
          <h2 className="text-[20px] font-semibold text-ink">{t("jnAmount")}</h2>
          {plan === "monthly" ? (
            <>
              <PlanCalculator className="mt-4" initial={monthly} hideJoin onChange={setMonthly} />
              <p className="mt-4 text-sm text-mute">{t("jnAmountMonthly", { left: SCHEME.months - 1 })}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="ghost" size="lg" onClick={() => setStep("details")}>{t("jnBack")}</Button>
                <Button variant="maroon" size="lg" onClick={() => setPaying(true)}>{t("jnPay", { amount: formatINR(monthly) })}</Button>
              </div>
              <PaymentSheet
                open={paying}
                amount={monthly}
                note={t("pbNote", { n: 1, months: SCHEME.months, id: `PLN-${state.plans.length + 1}` })}
                onClose={() => setPaying(false)}
                onPaid={() => {
                  const id = `PLN-${state.plans.length + 1}`;
                  dispatch({ type: "joinPlan", monthly });
                  dispatch({ type: "payInstalment", planId: id });
                  setNewPlanId(id);
                  setPaying(false);
                  setStep("done");
                }}
              />
            </>
          ) : (
            <>
              <DigiBuy className="mt-4 rounded-[6px] border border-line" showHoldings={false} onDone={() => setStep("done")} />
              <Button variant="ghost" className="mt-4" onClick={() => setStep("details")}>{t("jnBack")}</Button>
            </>
          )}
        </div>
      )}

      {step === "done" && (
        <div className="mt-8" data-testid="join-success">
          <p className="flex items-center gap-2 text-[24px] font-semibold text-ink">
            <Icon name="check" size={24} className="text-maroon" /> {t("jnSuccess")}
          </p>
          <p className="mt-2 text-[15px] text-mute">
            {plan === "monthly" ? t("jnSuccessMonthly", { name: name || state.user?.name || "", months: SCHEME.months }) : t("jnSuccessDigi", { name: name || state.user?.name || "" })}
          </p>
          <p className="mt-1 text-xs text-mute">{t("jnDemo")}</p>
          <div className="mt-6">
            {plan === "monthly" && newPlan ? <Passbook plan={newPlan} /> : <DigiHoldings className="rounded-[6px] border border-line bg-white p-5" />}
          </div>
          <div className="mt-6">
            <Button variant="maroon" href={routes.scheme()}>{t("jnBackToScheme")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
