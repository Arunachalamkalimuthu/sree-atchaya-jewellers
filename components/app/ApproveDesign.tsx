"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import type { Order } from "@/lib/demo-state";
import { useL10n, useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "@/components/ui/Button";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";
import { DesignSketch } from "./DesignSketch";
import { useAppLocal } from "./app-store";

/**
 * `<ApproveDesign order />`: the design-approval step of a custom order (status booked or design_approved).
 * Shows the designer's line sketch. "Approve design" has no action in the shared demo state, so the approval is
 * kept in the app's own store ("sa-app") and shown here as a confirmation; the tracker moves on one step locally.
 * "Ask for changes" opens ContactSheet.
 */
export function ApproveDesign({ order }: { order: Order }) {
  const t = useT(app);
  const tc = useT(common);
  const l = useL10n();
  const [local, update] = useAppLocal();
  const [contact, setContact] = useState(false);
  const spec = order.custom!;
  const localApproved = local.approved.includes(order.id);
  const approved = order.status === "design_approved" || localApproved;
  const type = l(CATEGORIES.find((c) => c.id === spec.type)!).toLowerCase();
  const purity = spec.purity === "22K" ? tc("purity916") : spec.purity === "silver" ? tc("rateSilver") : spec.purity;

  return (
    <section aria-labelledby="approve-title" className="border border-maroon/25 bg-white/75" data-testid="approve-card">
      <div className="flex items-start justify-between gap-3 border-b border-gold/40 px-4 pb-3 pt-4">
        <h2 id="approve-title" className="font-display text-[1.4rem] font-semibold leading-tight text-maroon">
          {approved ? t("apApprovedTitle") : t("apTitle")}
        </h2>
        {approved && <Icon name="check" size={22} className="mt-0.5 shrink-0 text-emerald" />}
      </div>
      <figure className="border-b border-gold/30 bg-[#fdfaf3] px-2 py-2">
        <DesignSketch kind={spec.type} notes={[purity, t("apWeight", { g: spec.approxWeightG })]} className="block h-auto w-full" />
        <figcaption className="sr-only">{t("apSketchAlt", { type })}</figcaption>
      </figure>
      <div className="px-4 py-4">
        {spec.notes && <p className="font-display text-[1.05rem] italic text-maroon-deep">{spec.notes}</p>}
        {approved ? (
          <div role="status" className={spec.notes ? "mt-3" : ""}>
            <p className="text-[15px] leading-snug text-emerald">{t("apDone")}</p>
            {localApproved && <p className="mt-1.5 text-[12.5px] text-ink/55">{t("apLocal")}</p>}
          </div>
        ) : (
          <>
            <p className={`text-[14.5px] leading-snug text-ink/75 ${spec.notes ? "mt-2" : ""}`}>{t("apBody")}</p>
            <div className="mt-4 grid gap-2.5">
              <Button variant="maroon" size="lg" full onClick={() => update({ approved: [...local.approved, order.id] })}>{t("apApprove")}</Button>
              <Button variant="ghost" full onClick={() => setContact(true)} aria-haspopup="dialog">{t("apChanges")}</Button>
            </div>
          </>
        )}
      </div>
      <ContactSheet open={contact} onClose={() => setContact(false)} />
    </section>
  );
}
