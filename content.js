function getArticleText() {
    const article = document.querySelector("article");
    if(article) {
        return article.innerText;
    }

    const paragraphs = Array.from(document.querySelector("p"));
    return paragraphs.map((p) => p.innerText).join("\n");
}

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_ARTICLE_TEXT') {
    const articleText = document.body.innerText;
    sendResponse({ text: articleText });
  }
  return true; // Needed if you're using sendResponse asynchronously
});

