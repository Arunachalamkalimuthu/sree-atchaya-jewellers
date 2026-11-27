"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { OFFER, SCHEME, SITE } from "@/lib/site.config";
import { demoSeed } from "@/lib/demo-state";
import { planSummary } from "@/lib/scheme";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";
import { Passbook } from "@/components/scheme/Passbook";
import { DigiBuy } from "@/components/scheme/DigiBuy";
import { AppHeader } from "./AppHeader";
import { SiteButton } from "./frame";

type Tab = "monthly" | "digi";

/** Scheme tab: Monthly savings (passbooks with Pay instalment) or Digi Gold (DigiBuy), and Redeem. Tab from ?tab=. */
export function SchemeScreen() {
  const t = useT(app);
  const { state, dispatch } = useDemo();
  const tab: Tab = useSearchParams().get("tab") === "digi" ? "digi" : "monthly";
  const [redeem, setRedeem] = useState(false);
  const [contact, setContact] = useState(false);

  const segs: { id: Tab; label: string; href: string }[] = [
    { id: "monthly", label: t("segMonthly"), href: routes.app.scheme() },
    { id: "digi", label: t("segDigi"), href: `${routes.app.scheme()}?tab=digi` },
  ];

  return (
    <>
      <AppHeader title={t("schemeTitle")} />

      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
        <nav aria-label={t("segLabel")} className="mb-5">
          <ul className="grid grid-cols-2 gap-1 rounded-[10px] bg-[#F2EEE9] p-1">
            {segs.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  replace
                  scroll={false}
                  aria-current={tab === s.id ? "page" : undefined}
                  className={`flex min-h-10 items-center justify-center rounded-[8px] px-2 text-center text-[14px] leading-tight focus-visible:outline-2 focus-visible:outline-maroon ${
                    tab === s.id ? "bg-maroon font-semibold text-white" : "text-ink hover:bg-white/70"
                  }`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {!state.user ? (
          <div className="rounded-[12px] border border-[#ECE6DF] bg-white px-4 py-4">
            <p className="text-[15px] leading-snug text-ink num">
              {t("schemeSignedOut", { paid: planSummary(demoSeed.plans[0]).paidCount, months: SCHEME.months })}
            </p>
            <Button variant="maroon" full className="mt-4" onClick={() => dispatch({ type: "signInDemo" })}>{t("demoCta")}</Button>
          </div>
        ) : tab === "monthly" ? (
          <>
            {state.plans.length === 0 ? (
              <div className="rounded-[12px] border border-[#ECE6DF] bg-white px-4 py-4">
                <p className="text-[15px] leading-snug text-ink">{t("noPlan")}</p>
                <SiteButton href={routes.schemeJoin("monthly")} className="mt-4">{t("joinMonthly")}</SiteButton>
              </div>
            ) : (
              <div className="space-y-5">
                {[...state.plans].reverse().map((p) => <Passbook key={p.id} plan={p} />)}
              </div>
            )}
            {state.plans.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={() => setRedeem(true)} aria-haspopup="dialog">{t("redeem")}</Button>
                <SiteButton variant="ghost" href={routes.schemeJoin("monthly")}>{t("joinAnother")}</SiteButton>
              </div>
            )}
          </>
        ) : (
          <>
            <DigiBuy className="overflow-hidden rounded-[12px] border border-[#ECE6DF]" />
            <Button variant="ghost" full className="mt-5" onClick={() => setRedeem(true)} aria-haspopup="dialog">{t("redeem")}</Button>
          </>
        )}
      </main>

      <RedeemSheet open={redeem} onClose={() => setRedeem(false)} digi={tab === "digi"} onTalk={() => { setRedeem(false); setContact(true); }} />
      <ContactSheet open={contact} onClose={() => setContact(false)} />
    </>
  );
}

function RedeemSheet({ open, onClose, digi, onTalk }: { open: boolean; onClose: () => void; digi: boolean; onTalk: () => void }) {
  const t = useT(app);
  const tc = useT(common);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={t("redeemTitle")}
      footer={<Button variant="maroon" full onClick={onTalk}>{tc("contactTitle")}</Button>}
    >
      <p className="text-[15px] leading-relaxed text-ink">{digi ? t("redeemDigi") : t("redeemBody", { pct: OFFER.wastagePct })}</p>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 border-y border-[#ECE6DF] py-4 text-sm">
        <dt className="flex items-center gap-2 text-[#6B5E57]"><Icon name="pin" size={16} />{tc("contactMain")}</dt>
        <dd>{tc("footerAddress", { pin: SITE.address.pin })}</dd>
        <dt className="flex items-center gap-2 text-[#6B5E57]"><Icon name="clock" size={16} />{tc("contactHoursLabel")}</dt>
        <dd>{tc("footerHours")}</dd>
      </dl>
      <p className="mt-4 text-[13px] text-[#8A7F78]">{t("redeemDemo")}</p>
    </Sheet>
  );
}
