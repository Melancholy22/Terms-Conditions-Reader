chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extract_terms") {
        console.log("Extracted Terms:", message.data);
        chrome.storage.local.set({ termsData: message.data });
    }
});
