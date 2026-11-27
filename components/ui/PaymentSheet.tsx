"use client";
import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/pricing";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Sheet } from "./Sheet";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Price } from "./Price";

export type PayMethod = "upi" | "card" | "netbanking";

/** Demo-only values shown in the mock payment forms. */
const DEMO_UPI = "priya@okdemo";
const DEMO_CARD = "4111 1111 1111 1111";
const DEMO_EXPIRY = "12/29";
const BANKS = ["State Bank of India", "Indian Bank", "Indian Overseas Bank", "Canara Bank", "City Union Bank", "Karur Vysya Bank", "HDFC Bank", "ICICI Bank"];

export const PAYMENT_PROCESSING_MS = 1200;

interface Props {
  open: boolean;
  amount: number;
  onPaid: (method: PayMethod) => void;
  onClose: () => void;
  /** Optional line under the amount, e.g. "Advance for SAJ-10002". */
  note?: string;
}

/**
 * `<PaymentSheet open amount onPaid(method) onClose>`: UPI, card or net banking, then a 1.2 s
 * "Processing…" step (sheet locked), then `onPaid(method)`. The parent closes it / navigates.
 * State resets every time it opens.
 */
export function PaymentSheet(props: Props) {
  return props.open ? <PaymentInner {...props} /> : null;
}

function PaymentInner({ amount, onPaid, onClose, note }: Props) {
  const t = useT(common);
  const [method, setMethod] = useState<PayMethod>("upi");
  const [bank, setBank] = useState(BANKS[0]);
  const [processing, setProcessing] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const paidRef = useRef(onPaid);
  useEffect(() => { paidRef.current = onPaid; });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pay = () => {
    setProcessing(true);
    timer.current = window.setTimeout(() => paidRef.current(method), PAYMENT_PROCESSING_MS);
  };

  const options: { id: PayMethod; icon: IconName; label: string; hint: string }[] = [
    { id: "upi", icon: "upi", label: t("payUpi"), hint: t("payUpiHint") },
    { id: "card", icon: "card", label: t("payCard"), hint: t("payCardHint") },
    { id: "netbanking", icon: "bank", label: t("payNet"), hint: t("payNetHint") },
  ];

  const footer = processing ? null : (
    <div>
      <Button variant="maroon" size="lg" full onClick={pay}>
        <Icon name="lock" size={16} />
        {t("payNow", { amount: formatINR(amount) })}
      </Button>
      <p className="mt-2.5 text-center text-[13px] text-mute">{t("payDemo")}</p>
    </div>
  );

  return (
    <Sheet open onClose={onClose} title={t("payTitle")} locked={processing} footer={footer} width="md">
      <div className="rounded-[6px] border border-line bg-cream px-5 py-4">
        <p className="text-[14px] text-mute">{t("payAmount")}</p>
        <Price value={amount} size="lg" className="mt-0.5 block text-maroon" />
        {note && <p className="mt-1 text-[14px] text-mute">{note}</p>}
      </div>

      {processing ? (
        <div role="status" aria-live="polite" className="flex flex-col items-center py-12 text-center">
          <span className="relative grid size-16 place-items-center">
            <span className="absolute inset-0 rounded-full border-2 border-line" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-maroon motion-reduce:animate-none" />
            <Icon name="lock" size={20} className="text-maroon" />
          </span>
          <p className="mt-5 text-[20px] font-semibold text-ink">{t("payProcessing")}</p>
          <p className="mt-1 text-[14px] text-mute">{t("payProcessingNote")}</p>
          <p className="mt-6 text-[13px] text-mute">{t("payDemo")}</p>
        </div>
      ) : (
        <fieldset className="mt-5">
          <legend className="mb-2.5 text-[14px] font-semibold text-ink">{t("payChoose")}</legend>
          <div className="space-y-2.5">
            {options.map((o) => {
              const active = method === o.id;
              return (
                <div key={o.id} className={`rounded-[4px] border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${active ? "border-maroon bg-maroon/[0.03]" : "border-line bg-white hover:border-maroon/50"}`}>
                  <label className="flex cursor-pointer items-center gap-3.5 px-4 py-3.5">
                    <input type="radio" name="pay-method" value={o.id} checked={active} onChange={() => setMethod(o.id)} className="sr-only" />
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full ${active ? "bg-maroon text-white" : "bg-cream text-maroon"}`}>
                      <Icon name={o.icon} size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-semibold text-ink">{o.label}</span>
                      <span className="block text-[13.5px] leading-snug text-mute">{o.hint}</span>
                    </span>
                    <span aria-hidden className={`grid size-5 shrink-0 place-items-center rounded-full border ${active ? "border-maroon" : "border-ink/25"}`}>
                      {active && <span className="size-2.5 rounded-full bg-maroon" />}
                    </span>
                  </label>
                  {active && (
                    <div className="border-t border-line px-4 py-3.5">
                      {o.id === "upi" && <DemoInput label={t("payUpiId")} value={DEMO_UPI} />}
                      {o.id === "card" && (
                        <div className="grid grid-cols-[1fr_6rem] gap-3">
                          <DemoInput label={t("payCardNumber")} value={DEMO_CARD} />
                          <DemoInput label={t("payCardExpiry")} value={DEMO_EXPIRY} />
                        </div>
                      )}
                      {o.id === "netbanking" && (
                        <label className="block">
                          <span className="text-[13px] text-mute">{t("payBank")}</span>
                          <select
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            className="mt-1 h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[16px] text-ink focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-gold"
                          >
                            {BANKS.map((b) => <option key={b}>{b}</option>)}
                          </select>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      )}
    </Sheet>
  );
}

function DemoInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="block min-w-0">
      <span className="text-[13px] text-mute">{label}</span>
      <input
        readOnly
        value={value}
        className="mt-1 h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[16px] tracking-wide text-ink tabular-nums focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-gold"
      />
    </label>
  );
}
