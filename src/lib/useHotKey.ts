import { useEffect } from "react";

export function useHotkey(hotkey, callback) {
  useEffect(() => {
    if (!hotkey) return;

    const combo = hotkey.toLowerCase().split("+").map(k => k.trim());
    
    function handler(e) {
      const key = e.key.toLowerCase();

      const needsCtrl = combo.includes("ctrl") || combo.includes("cmd");
      const needsShift = combo.includes("shift");
      const needsAlt = combo.includes("alt");
      const targetKey = combo.find(k => !["ctrl", "cmd", "shift", "alt"].includes(k));

      if (needsCtrl && !(e.ctrlKey || e.metaKey)) return;
      if (needsShift && !e.shiftKey) return;
      if (needsAlt && !e.altKey) return;
      if (targetKey && key !== targetKey) return;

      e.preventDefault();
      callback(e);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkey, callback]);
}
