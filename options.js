document.addEventListener("DOMContentLoaded", () => {
  // Load saved API key if it exists
  chrome.storage.sync.get(["GeminiApiKey"], (result) => {
    if (result.GeminiApiKey) {
      document.getElementById("api-key").value = result.GeminiApiKey;
    }
  });

  // Save API key when button is clicked
  document.getElementById("save-button").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key").value.trim();

    if (apiKey) {
      chrome.storage.sync.set({ GeminiApiKey: apiKey }, () => {
        const successMessage = document.getElementById("success-message");
        successMessage.style.display = "block";

        // Delay tab close for user to see the message
        setTimeout(() => {
          // Attempt to close the window
          window.close();

          // If window.close() fails, try removing the tab (not guaranteed to work from options page)
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.remove(tabs[0].id);
            }
          });
        }, 2000); // Increased to 2 seconds for visibility
      });
    }
  });
});
