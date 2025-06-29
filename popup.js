// document.getElementById("summarize").addEventListener("click", async () => {
//   const result = document.getElementById("result");
//   result.textContent = 'Extracting Text...';

//   chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//     chrome.tabs.sendMessage(
//       tab.id,
//       { type: 'GET_ARTICLE_TEXT' },
//       (response) => {
//         if (chrome.runtime.lastError) {
//           result.textContent = "Could not connect to content script.";
//           console.error(chrome.runtime.lastError.message);
//           return;
//         }

//         const text = response?.text;

//         result.textContent = text
//           ? text.slice(0, 300) + "..."
//           : "No article text found.";
//       }
//     );
//   });
// });

document.getElementById("summarize").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  const summaryType = document.getElementById("summary-type").value;
  resultDiv.innerHTML = '<div class="loader" ></div>';

  //get users gemini api key
  chrome.storage.sync.get(['GeminiApiKey'], ({GeminiApiKey}) => {
    if(!GeminiApiKey){
      resultDiv.textContext = "No API Key detected, please generate one using the gear icon.";
      return;
    }

    //ask content.js for the page text
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // Inject content.js first
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"]
      },
      () => {
        if (chrome.runtime.lastError) {
          result.textContent = "Failed to inject content script.";
          console.error(chrome.runtime.lastError.message);
          return;
        }

        // Now send message to content.js
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'GET_ARTICLE_TEXT' },
          async({text}) => {
            if(!text){
              resultDiv.textContent = "Couldn't extract text from this page.";
              return;
            }
              //send text to Gemini
          try{
              const summary = await getGeminiSummary(
                text,
                summaryType, 
                GeminiApiKey
              );

              resultDiv.textContent = summary;
            }catch(error){
              resultDiv.textContent = "Gemini error "+ error.message;
            }
          }
        );
      }
    );
  });
});
  



  
});

async function getGeminiSummary(rawText, type, apiKey){
  const max = 20000;
  const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

  const promptMap = {
    breif: `Summarize in 2-3 sentences:\n\n${text}`,
    detailed: `Give a detailed summary:\n\n${text}`,
    bullets: `Summarize in 5-7 bullet points:\n\n${text}`,
  };

  const prompt = promptMap[type] || promptMap.breif;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  }),
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "API request failed");
  }

  const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary available."
    );
    
}
document.getElementById("copy-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;
  if (!summaryText.trim()) return;

  navigator.clipboard
    .writeText(summaryText)
    .then(() => {
      const copyBtn = document.getElementById("copy-btn");
      const originalText = copyBtn.textContent;

      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});


