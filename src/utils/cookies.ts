export const getCookieValue = (name: string): Promise<string | null> => {
  const isChromeApiAvailable =
    typeof chrome !== "undefined" && !!chrome.cookies;

  if (isChromeApiAvailable) {
    return new Promise((resolve) => {
      const url =
        (typeof location !== "undefined" && location.href) ||
        "https://dev.azure.com/";
      chrome.cookies.get({ url, name }, (cookie) => {
        if (cookie && cookie.value) resolve(cookie.value);
        else resolve(null);
      });
    });
  }

  // Fallback for DEV: parse document.cookie
  try {
    const esc = name.replace(/([.*+?^${}()|[\\]\/\\])/g, "\\$1");
    const regex = new RegExp("(?:^|; )" + esc + "=([^;]*)");
    const matches = document.cookie.match(regex);
    return Promise.resolve(matches ? decodeURIComponent(matches[1]) : null);
  } catch {
    return Promise.resolve(null);
  }
};
