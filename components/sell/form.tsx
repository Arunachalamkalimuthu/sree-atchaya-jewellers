"use client";
import { useId, type ReactNode } from "react";

/** Shared form bits for the sell / release and custom-order pages. */
export const inputCls =
  "block w-full min-h-11 rounded-[4px] border border-ink/20 bg-white px-3 py-2 text-[15px] text-ink placeholder:text-ink/40 " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold aria-[invalid=true]:border-maroon aria-[invalid=true]:bg-maroon/5";

export function Field({
  label, hint, error, children,
}: {
  label: string; hint?: string; error?: string | null;
  children: (a: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const describedBy = [hint ? `${id}-h` : "", error ? `${id}-e` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && <p id={`${id}-h`} className="mt-1.5 text-[13px] leading-snug text-mute">{hint}</p>}
      {error && <p id={`${id}-e`} role="alert" className="mt-1.5 text-[13px] font-medium text-maroon">{error}</p>}
    </div>
  );
}

export function Segmented<V extends string>({
  legend, name, value, onChange, options,
}: { legend: string; name: string; value: V; onChange: (v: V) => void; options: { value: V; label: string }[] }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input
              type="radio" name={name} value={o.value} checked={value === o.value}
              onChange={() => onChange(o.value)} className="peer sr-only"
            />
            <span className="flex min-h-11 items-center rounded-[4px] border border-ink/20 bg-white px-4 text-sm text-ink peer-checked:border-maroon peer-checked:bg-maroon peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
