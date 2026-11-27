"use client";
import { useState, type ReactNode } from "react";
import { SITE } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ContactSheet, type ContactTopic } from "@/components/ui/ContactSheet";
import { LangToggle } from "@/components/ui/LangToggle";
import { Icon } from "@/components/ui/Icon";
import { useHydrated } from "@/components/orders/useHydrated";
import { AppHeader } from "./AppHeader";
import { SiteLink } from "./frame";
import { AppIcon } from "./AppIcons";
import { useAppLocal } from "./app-store";

const RELATIONS = ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"] as const;
const field = "mt-1 h-12 w-full border border-maroon/25 bg-white px-3 text-[16px] text-maroon-deep focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-gold";
const rowBtn = "flex w-full items-center gap-3 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-gold";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="font-display text-[1.25rem] font-semibold text-maroon">{title}</h2>
      <div className="mt-1.5 divide-y divide-gold/30 border-y border-gold/40">{children}</div>
    </section>
  );
}

function Line({ label, value, children }: { label: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <div className="min-w-0">
        <p className="text-[15px] text-ink">{label}</p>
        {value && <p className="mt-0.5 text-[13px] leading-snug text-ink/60">{value}</p>}
      </div>
      {children}
    </div>
  );
}

/** Profile tab: the account, language, KYC, nominee, addresses and Talk to us (ContactSheet). */
export function ProfileScreen() {
  const t = useT(app);
  const tc = useT(common);
  const ts = useT(scheme);
  const hydrated = useHydrated();
  const { state, dispatch } = useDemo();
  const [local, update] = useAppLocal();
  const [sheet, setSheet] = useState<"nominee" | "address" | null>(null);
  const [contact, setContact] = useState<ContactTopic | null>(null);

  const relation = local.nominee ? ts(`rel${local.nominee.relation}` as "relSpouse") : "";

  return (
    <>
      <AppHeader title={t("profileTitle")} />
      <main className="mx-auto w-full max-w-xl px-4 pb-10">
        {!hydrated ? null : state.user ? (
          <div className="-mx-4 bg-maroon-deep px-4 py-5 text-ivory">
            <p className="font-display text-[1.7rem] font-semibold leading-tight text-gold-light">{state.user.name}</p>
            <p className="mt-0.5 text-[14px] text-ivory/75 num">{state.user.phone}</p>
            <p className="mt-2 text-[12.5px] text-ivory/55">{t("profileNote")}</p>
          </div>
        ) : (
          <div className="pt-6">
            <h2 className="font-display text-[1.6rem] font-semibold text-maroon">{t("profileSignedOut")}</h2>
            <p className="mt-1.5 text-[15px] leading-snug text-ink/75">{t("profileSignedOutBody")}</p>
            <Button variant="maroon" full className="mt-4" onClick={() => dispatch({ type: "signInDemo" })}>{t("profileUseDemo")}</Button>
          </div>
        )}

        <div className="mt-6 border-y border-gold/40">
          <Line label={tc("language")}><LangToggle /></Line>
        </div>

        {state.user && (
          <>
            <Group title={t("kyc")}>
              <Line label={t("kycMobile")} value={state.user.phone}>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald"><Icon name="check" size={15} />{t("kycVerified")}</span>
              </Line>
              <Line label={t("kycId")} value={t("kycIdNote")} />
            </Group>

            <Group title={t("nominee")}>
              <button type="button" className={rowBtn} onClick={() => setSheet("nominee")} aria-haspopup="dialog">
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] text-ink">{local.nominee ? local.nominee.name : t("nomineeAdd")}</span>
                  <span className="mt-0.5 block text-[13px] text-ink/60">{local.nominee ? relation : t("nomineeNone")}</span>
                </span>
                <span className="text-[13px] text-maroon">{local.nominee ? t("nomineeEdit") : ""}</span>
                <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
              </button>
            </Group>

            <Group title={t("addresses")}>
              <Line label={t("addrPickup")} value={`${tc("footerAddress", { pin: SITE.address.pin })}. ${t("addrPickupSub")}`}>
                <Icon name="pin" size={18} className="shrink-0 text-maroon/60" />
              </Line>
              <button type="button" className={rowBtn} onClick={() => setSheet("address")} aria-haspopup="dialog">
                <span className="min-w-0 flex-1">
                  {local.address ? (
                    <>
                      <span className="block text-[15px] text-ink">{local.address.line}</span>
                      <span className="mt-0.5 block text-[13px] text-ink/60 num">{local.address.city} {local.address.pin}</span>
                    </>
                  ) : (
                    <span className="block text-[15px] text-maroon">{t("addrAdd")}</span>
                  )}
                </span>
                <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
              </button>
            </Group>
          </>
        )}

        <Group title={t("help")}>
          <button type="button" className={rowBtn} onClick={() => setContact("general")} aria-haspopup="dialog">
            <Icon name="chat" size={20} className="shrink-0 text-maroon" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] text-ink">{tc("contactTitle")}</span>
              <span className="block text-[13px] text-ink/60">{tc("contactWays")}</span>
            </span>
            <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
          </button>
          <button type="button" className={rowBtn} onClick={() => setContact("goldRelease")} aria-haspopup="dialog">
            <Icon name="lock" size={20} className="shrink-0 text-maroon" />
            <span className="min-w-0 flex-1 text-[15px] text-ink">{tc("contactRelease")}</span>
            <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
          </button>
          <SiteLink href={routes.home()} className={rowBtn}>
            <AppIcon name="home" size={20} className="shrink-0 text-maroon" />
            <span className="min-w-0 flex-1 text-[15px] text-ink">{t("qrWebsite")}</span>
            <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
          </SiteLink>
        </Group>

        {state.user && (
          <Button variant="ghost" full className="mt-8" onClick={() => dispatch({ type: "signOut" })}>{t("signOut")}</Button>
        )}
      </main>

      <NomineeSheet open={sheet === "nominee"} onClose={() => setSheet(null)} initial={local.nominee} onSave={(nominee) => { update({ nominee }); setSheet(null); }} />
      <AddressSheet open={sheet === "address"} onClose={() => setSheet(null)} initial={local.address} onSave={(address) => { update({ address }); setSheet(null); }} />
      <ContactSheet open={contact !== null} onClose={() => setContact(null)} topic={contact ?? "general"} />
    </>
  );
}

function NomineeSheet({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: { name: string; relation: string }; onSave: (n: { name: string; relation: string }) => void }) {
  const t = useT(app);
  const ts = useT(scheme);
  return (
    <Sheet open={open} onClose={onClose} title={t("nominee")}>
      <form
        key={String(open)}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({ name: String(f.get("name")).trim(), relation: String(f.get("relation")) });
        }}
      >
        <label className="block text-sm text-maroon-deep/75">
          {ts("jnNomineeName")}
          <input name="name" className={field} defaultValue={initial?.name} required minLength={2} data-autofocus />
        </label>
        <label className="mt-4 block text-sm text-maroon-deep/75">
          {ts("jnRelation")}
          <select name="relation" className={field} defaultValue={initial?.relation ?? ""} required>
            <option value="" disabled>{ts("jnRelPick")}</option>
            {RELATIONS.map((r) => <option key={r} value={r}>{ts(`rel${r}` as "relSpouse")}</option>)}
          </select>
        </label>
        <Button type="submit" variant="maroon" size="lg" full className="mt-6">{t("save")}</Button>
        <p className="mt-3 text-[12.5px] text-ink/55">{t("savedLocal")}</p>
      </form>
    </Sheet>
  );
}

function AddressSheet({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: { line: string; city: string; pin: string }; onSave: (a: { line: string; city: string; pin: string }) => void }) {
  const t = useT(app);
  return (
    <Sheet open={open} onClose={onClose} title={initial ? t("addrEdit") : t("addrAdd")}>
      <form
        key={String(open)}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave({ line: String(f.get("line")).trim(), city: String(f.get("city")).trim(), pin: String(f.get("pin")).trim() });
        }}
      >
        <label className="block text-sm text-maroon-deep/75">
          {t("addrLine")}
          <input name="line" className={field} defaultValue={initial?.line} required minLength={4} autoComplete="street-address" data-autofocus />
        </label>
        <div className="mt-4 grid grid-cols-[1fr_8rem] gap-3">
          <label className="block text-sm text-maroon-deep/75">
            {t("addrCity")}
            <input name="city" className={field} defaultValue={initial?.city} required autoComplete="address-level2" />
          </label>
          <label className="block text-sm text-maroon-deep/75">
            {t("addrPin")}
            <input name="pin" className={field} defaultValue={initial?.pin} required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="postal-code" />
          </label>
        </div>
        <Button type="submit" variant="maroon" size="lg" full className="mt-6">{t("save")}</Button>
        <p className="mt-3 text-[12.5px] text-ink/55">{t("savedLocal")}</p>
      </form>
    </Sheet>
  );
}
