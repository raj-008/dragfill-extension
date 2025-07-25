let isInjected = false;

chrome.action.onClicked.addListener(async (tab) => {
  if (!isInjected) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["injectPanel.js", "content.js"]
    });
    isInjected = true;
  } else {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const existing = document.getElementById('dragfill-panel');
        if (existing) existing.remove();
      }
    });
    isInjected = false;
  }
});
