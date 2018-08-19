  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "sampleContextMenu",
      "title": "Sample Context Menu",
      "contexts": ["selection"]
    });
  });

  chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScZActXpbHjAZf1Qi5BsOCy8HN74oXSlKEZSccNdfzDrLRGSA/viewform")