"use client";
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Icon } from "./Icon";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Sticky area under the content (primary actions). */
  footer?: ReactNode;
  /** Desktop dialog width. Default "md" (28rem). */
  width?: "sm" | "md" | "lg";
  /** Hide the close button and ignore Escape/backdrop (e.g. while a payment is processing). */
  locked?: boolean;
}

const noop = () => () => {};
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour shared by Sheet and the header's mobile menu: while `open`, lock page scroll, move focus into
 * `panel` (its first [autofocus] element, else the panel), keep Tab inside it, close on Escape (unless `locked`),
 * and give focus back to whatever had it when the modal closes.
 */
export function useModalFocus(open: boolean, panel: RefObject<HTMLElement | null>, onClose: () => void, locked = false) {
  const closeRef = useRef(onClose);
  const lockedRef = useRef(locked);
  useEffect(() => { closeRef.current = onClose; lockedRef.current = locked; });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      const el = panel.current;
      (el?.querySelector<HTMLElement>("[autofocus],[data-autofocus]") ?? el)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lockedRef.current) { e.stopPropagation(); closeRef.current(); }
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open, panel]);
}
const widths = { sm: "sm:max-w-sm", md: "sm:max-w-md", lg: "sm:max-w-xl" };

/**
 * `<Sheet open onClose title>`: a bottom sheet on phones, a centred dialog from 640px up.
 * Rendered in a portal on <body>; Escape and the backdrop close it; focus moves in and is restored on close.
 */
export function Sheet({ open, onClose, title, children, footer, width = "md", locked = false }: SheetProps) {
  const t = useT(common);
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  useModalFocus(open, panel, onClose, locked);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden
        className="sa-fade absolute inset-0 bg-[#1d0d0b]/55"
        onClick={() => !locked && onClose()}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`sa-sheet relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[16px] bg-white text-ink shadow-[0_-12px_40px_rgba(42,26,20,.18)] outline-none sm:rounded-[8px] sm:shadow-[0_24px_60px_rgba(42,26,20,.25)] ${widths[width]}`}
      >
        <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-ink/15 sm:hidden" />
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-3 pb-3 sm:px-7 sm:pt-6">
          <h2 id={titleId} className="text-[1.375rem] font-semibold leading-tight text-ink">
            {title}
          </h2>
          {!locked && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-maroon/70 transition-colors hover:bg-maroon/5 hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name="close" />
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-7 sm:pb-7">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
