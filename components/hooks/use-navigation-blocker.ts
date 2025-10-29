import { useEffect, useRef } from "react";

/**
 * Prevents navigation (Back, Link clicks, Refresh, Close tab)
 * during a test or exam session.
 *
 * Example: useNavigationBlocker(true);
 */
export const useNavigationBlocker = (isBlocking: boolean = true) => {
  const hasPushedState = useRef(false);

  useEffect(() => {
    if (!isBlocking) return;

    // --- 1. Handle refresh / tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your IELTS test progress will be lost.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // --- 2. Push only once to trap Back button
    if (!hasPushedState.current) {
      try {
        window.history.pushState({ guarded: true }, "", window.location.href);
        hasPushedState.current = true;
      } catch {}
    }

    // --- 3. Intercept Back/Forward button
    const handlePopState = () => {
      const ok = window.confirm(
        "⚠️ Are you sure you want to leave? Your test progress will be lost."
      );
      if (ok) {
        // allow going back once
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("click", handleDocumentClick, true);
        history.back();
      } else {
        // stay on page by restoring state
        try {
          history.pushState({ guarded: true }, "", window.location.href);
        } catch {}
      }
    };
    window.addEventListener("popstate", handlePopState);

    // --- 4. Intercept internal link clicks
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
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("click", handleDocumentClick, true);
        window.location.href = href;
      }
    };
    document.addEventListener("click", handleDocumentClick, true);

    // --- 5. Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isBlocking]);
};
