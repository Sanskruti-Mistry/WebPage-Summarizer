chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["GeminiApiKey"], (result) => {
        if (!result.GeminiApiKey) {
            chrome.tabs.create({ url: "options.html" });
        }
    });
});
