let pendingTimeout: number | undefined;
let lastWritten = "";

// Normalize badge text: treat "0" as empty to avoid a visible '0' flash.
const normalize = (text: string) => (text === "0" ? "" : text);

export const setTextBadge = async (text: string) => {
  const normalized = normalize(text);

  if (normalized === lastWritten) return;

  if (pendingTimeout) {
    clearTimeout(pendingTimeout);
  }

  pendingTimeout = window.setTimeout(async () => {
    try {
      await chrome.action.setBadgeText({ text: normalized });
      lastWritten = normalized;
    } catch (e) {
      console.debug("setTextBadge failed:", e);
    }
    pendingTimeout = undefined;
  }, 200) as unknown as number;
};
