"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "./Button";
import { Icon } from "./Icon";

/** The one code the demo accepts. "Fill code" types it so nobody has to. */
export const DEMO_OTP = "482916";

/**
 * `<OtpField phone onVerified>`: simulated phone OTP. "Fill code" fills 482916; Verify checks it (0.6 s)
 * and calls `onVerified()` once. Then it shows a verified state.
 */
export function OtpField({ phone, onVerified, className = "" }: { phone: string; onVerified: () => void; className?: string }) {
  const t = useT(common);
  const id = useId();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "ok">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const verify = () => {
    if (state === "checking" || state === "ok") return;
    setState("checking");
    timer.current = window.setTimeout(() => {
      if (code === DEMO_OTP) { setState("ok"); onVerified(); } else setState("wrong");
    }, 600);
  };

  if (state === "ok") {
    return (
      <div className={`flex items-center gap-3 rounded-[4px] border border-line bg-cream px-4 py-3 ${className}`}>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-maroon text-white"><Icon name="check" size={16} /></span>
        <span className="text-[15px] font-medium text-ink">{t("otpVerified", { phone })}</span>
      </div>
    );
  }

  const digits = code.padEnd(6, " ").split("");
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[14px] text-ink">{t("otpSentTo", { phone })}</label>
      <div className="group relative mt-3">
        {/* One real input (autofill, paste, screen readers) under six drawn boxes. */}
        <input
          id={id}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          aria-label={t("otpLabel")}
          aria-invalid={state === "wrong"}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); if (state === "wrong") setState("idle"); }}
          onKeyDown={(e) => { if (e.key === "Enter") verify(); }}
          className="absolute inset-0 z-10 w-full cursor-text opacity-0"
        />
        <div aria-hidden className="grid grid-cols-6 gap-2">
          {digits.map((d, i) => (
            <span
              key={i}
              className={`grid h-13 place-items-center rounded-[4px] border bg-white text-[22px] font-semibold text-ink tabular-nums transition-colors ${
                state === "wrong" ? "border-maroon" : i === Math.min(code.length, 5) ? "border-line group-focus-within:border-gold group-focus-within:ring-1 group-focus-within:ring-gold" : "border-line"
              }`}
            >
              {d.trim()}
            </span>
          ))}
        </div>
      </div>
      {state === "wrong" && <p role="alert" className="mt-2 text-[13px] text-maroon">{t("otpWrong")}</p>}
      <div className="mt-4 flex gap-3">
        <Button variant="ghost" onClick={() => { setCode(DEMO_OTP); setState("idle"); }} className="flex-1">{t("otpFill")}</Button>
        <Button variant="maroon" onClick={verify} disabled={code.length < 6 || state === "checking"} className="flex-1">
          {state === "checking" ? t("otpVerifying") : t("otpVerify")}
        </Button>
      </div>
      <p className="mt-3 text-[13px] text-mute">{t("otpDemo")}</p>
    </div>
  );
}
