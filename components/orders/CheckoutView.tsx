"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { cartTotals, demoSeed } from "@/lib/demo-state";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "@/components/ui/Button";
import { OtpField } from "@/components/ui/OtpField";
import { PaymentSheet, type PayMethod } from "@/components/ui/PaymentSheet";
import { useHydrated } from "./useHydrated";
import { Totals } from "./Totals";

type Fulfilment = "pickup" | "delivery";

const field =
  "mt-1.5 block min-h-11 w-full rounded-[4px] border border-line bg-white px-3.5 text-[16px] text-ink " +
  "placeholder:text-mute/60 focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-gold";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[6px] border border-line bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-3 text-[20px] font-semibold text-ink">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-maroon text-[15px] font-semibold text-white">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CheckoutView() {
  const t = useT(checkout);
  const c = useT(common);
  const router = useRouter();
  const hydrated = useHydrated();
  const { state, dispatch } = useDemo();

  // Form values live here, above everything language-dependent, so switching language never clears them.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [fulfil, setFulfil] = useState<Fulfilment>("pickup");
  const [addr, setAddr] = useState({ line: "", city: "", pin: "" });
  const [payOpen, setPayOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  const lines = state.cart.filter((x) => getProduct(x.slug));
  const totals = cartTotals(lines);
  const user = state.user;
  const phoneOk = /^\d{10}$/.test(phone);
  const nameOk = name.trim().length > 1;
  const addrOk = fulfil === "pickup" || (addr.line.trim() && addr.city.trim() && /^\d{6}$/.test(addr.pin));
  const ready = !!user && !!addrOk;

  const sendCode = () => {
    if (nameOk && phoneOk) { setShowErr(false); setCodeSent(true); } else setShowErr(true);
  };

  const onPaid = (method: PayMethod) => {
    const id = `SAJ-${state.nextId}`;
    setPlacing(true);
    setPayOpen(false);
    dispatch({
      type: "placeOrder",
      order: { kind: "catalog", lines, fulfilment: fulfil, total: totals.total, advancePaid: totals.payNow, payMethod: method },
    });
    router.push(routes.order(id));
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p className="text-mute" role="status">{t("loading")}</p></div>;
  }
  if (placing) {
    return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p className="text-[22px] font-semibold text-maroon" role="status">{t("placing")}</p></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">{t("checkoutTitle")}</h1>

      {lines.length === 0 ? (
        <div className="mt-10 max-w-xl">
          <p className="text-[16px] text-mute">{t("checkoutEmpty")}</p>
          <Button href={routes.shop()} variant="maroon" size="lg" className="mt-6">{t("cartEmptyCta")}</Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="space-y-5">
            <Step n={1} title={t("stepSignIn")}>
              {user ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[16px] text-ink">{t("signedInAs", { name: user.name, phone: user.phone })}</p>
                  <button
                    type="button"
                    onClick={() => { dispatch({ type: "signOut" }); setCodeSent(false); }}
                    className="min-h-10 text-[14px] text-maroon underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold"
                  >
                    {t("changeUser")}
                  </button>
                </div>
              ) : (
                <div className="max-w-lg">
                  <Button variant="maroon" onClick={() => dispatch({ type: "signInDemo" })}>{t("useDemo")}</Button>
                  <p className="mt-2 text-[14px] text-mute">{t("useDemoNote", { name: demoSeed.user!.name })}</p>

                  <p className="mt-8 text-[16px] font-semibold text-ink">{t("orPhone")}</p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <label className="block text-[14px] text-ink">
                      {t("nameLabel")}
                      <input className={field} value={name} autoComplete="name" disabled={codeSent} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label className="block text-[14px] text-ink">
                      {t("phoneLabel")}
                      <input
                        className={field}
                        value={phone}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        disabled={codeSent}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-[13px] text-mute">{t("phoneHint")}</p>
                  {showErr && !(nameOk && phoneOk) && <p role="alert" className="mt-2 text-[14px] text-maroon">{t("signInInvalid")}</p>}
                  {!codeSent ? (
                    <Button variant="ghost" onClick={sendCode} className="mt-4">{t("sendCode")}</Button>
                  ) : (
                    <>
                    <button type="button" onClick={() => setCodeSent(false)} className="mt-4 min-h-10 text-[14px] text-maroon underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">{t("changeNumber")}</button>
                    <OtpField
                      phone={`+91 ${phone}`}
                      className="mt-5"
                      onVerified={() => dispatch({ type: "signIn", name: name.trim(), phone: `+91 ${phone}` })}
                    />
                    </>
                  )}
                </div>
              )}
            </Step>

            <Step n={2} title={t("stepFulfil")}>
              <div role="radiogroup" aria-label={t("stepFulfil")} className="grid max-w-2xl gap-3 sm:grid-cols-2">
                {(["pickup", "delivery"] as const).map((f) => (
                  <label
                    key={f}
                    className={`block cursor-pointer rounded-[4px] border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                      fulfil === f ? "border-maroon bg-maroon/[0.04]" : "border-line hover:border-maroon/50"
                    }`}
                  >
                    <input type="radio" name="fulfil" value={f} checked={fulfil === f} onChange={() => setFulfil(f)} className="sr-only" />
                    <span className="block text-[16px] font-semibold text-ink">{t(f === "pickup" ? "pickup" : "delivery")}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-mute">{t(f === "pickup" ? "pickupNote" : "deliveryNote")}{f === "pickup" ? ` ${c("footerHours")}.` : ""}</span>
                  </label>
                ))}
              </div>
              {fulfil === "delivery" && (
                <div className="mt-5 grid max-w-2xl gap-4 sm:grid-cols-2">
                  <label className="block text-[14px] text-ink sm:col-span-2">
                    {t("addrLine")}
                    <input className={field} value={addr.line} autoComplete="street-address" onChange={(e) => setAddr({ ...addr, line: e.target.value })} />
                  </label>
                  <label className="block text-[14px] text-ink">
                    {t("addrCity")}
                    <input className={field} value={addr.city} autoComplete="address-level2" onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                  </label>
                  <label className="block text-[14px] text-ink">
                    {t("addrPin")}
                    <input
                      className={field}
                      value={addr.pin}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      onChange={(e) => setAddr({ ...addr, pin: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    />
                  </label>
                </div>
              )}
            </Step>

            <Step n={3} title={t("stepPay")}>
              <p className="max-w-xl text-[15px] leading-relaxed text-mute">{t("payStepBody", { amount: formatINR(totals.payNow) })}</p>
              <Button variant="maroon" size="lg" disabled={!ready} onClick={() => setPayOpen(true)} className="mt-5 min-w-64">
                {c("payNow", { amount: formatINR(totals.payNow) })}
              </Button>
              {!ready && <p className="mt-2 text-[14px] text-mute">{t("payBlocked")}</p>}
            </Step>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Totals {...totals} />
          </div>
        </div>
      )}

      <PaymentSheet open={payOpen} amount={totals.payNow} onPaid={onPaid} onClose={() => setPayOpen(false)} />
    </div>
  );
}
