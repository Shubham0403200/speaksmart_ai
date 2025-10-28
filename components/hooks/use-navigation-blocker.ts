import { useEffect } from "react";

/**
 * Prevents navigation (Back button, Link clicks, Refresh, Close tab)
 * while a critical test or exam is running.
 *
 * Call this hook in your component:
 *   useNavigationBlocker(true);
 */
export const useNavigationBlocker = (isBlocking: boolean = true) => {
  useEffect(() => {
    if (!isBlocking) return;

    let unblockOnce = false;

    // 1) beforeunload — handles refresh / tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your IELTS test progress will be lost.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2) push fake history state for Back button
    try {
      window.history.pushState({ guarded: true }, "", window.location.href);
    } catch {}

    // 3) handle Back/Forward button
    const handlePopState = () => {
      const ok = window.confirm(
        "⚠️ Are you sure you want to leave? Your IELTS test progress will be lost."
      );
      if (ok) {
        unblockOnce = true;
        // Let browser actually go back
        history.back();
      } else {
        try {
          // Push again to prevent exit
          history.pushState({ guarded: true }, "", window.location.href);
        } catch {}
      }
    };
    window.addEventListener("popstate", handlePopState);

    // 4) Intercept internal link clicks (Next.js Links, anchors)
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

      const isInternal =
        href.startsWith("/") || href.startsWith(window.location.origin);
      if (!isInternal) return;

      e.preventDefault();

      const ok = window.confirm(
        "⚠️ Are you sure you want to leave? Your IELTS test progress will be lost."
      );
      if (ok) {
        unblockOnce = true;
        window.location.href = href; // force navigate
      }
    };
    document.addEventListener("click", handleDocumentClick, true);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
      if (!unblockOnce) {
        try {
          history.replaceState({}, "", window.location.href);
        } catch {}
      }
    };
  }, [isBlocking]);
};
