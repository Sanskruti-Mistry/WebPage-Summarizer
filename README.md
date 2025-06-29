# 📰 Web Page Summarizer - Chrome Extension

This is a Chrome Extension that uses Google's Gemini API to extract and summarize the main content of any web page you visit. Ideal for students, researchers, professionals, or anyone who wants to get quick insights from long articles.

---

## 🚀 Features

- 🔍 **One-click summarization** of articles and web pages.
- 🤖 Powered by **Google Gemini API** for advanced AI-based summarization.
- 💡 Intuitive and clean user interface.
- 🔐 Stores and retrieves your API key securely using Chrome Storage.

---

## 🛠️ Tech Stack

- HTML, CSS, JavaScript (Vanilla)
- Chrome Extension APIs
- Gemini API (Google Generative Language API)

---

## 📦 Folder Structure

```bash
WebPage-Summarizer/
├── manifest.json         # Chrome Extension config
├── popup.html            # UI for the extension popup
├── popup.js              # Logic to handle summarization button
├── options.html          # Page to save API key
├── options.js            # Logic to save/retrieve Gemini API key
├── background.js         # Optional: for handling background tasks
├── content.js            # Extracts main article content from web pages
└── styles.css            # Basic styling
