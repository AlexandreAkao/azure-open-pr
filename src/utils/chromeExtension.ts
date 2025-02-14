export const setTextBadge = async (text: string) => {
  await chrome.action.setBadgeText({ text });
};
