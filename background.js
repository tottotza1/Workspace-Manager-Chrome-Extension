  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "sampleContextMenu",
      "title": "Sample Context Menu",
      "contexts": ["selection"]
    });
  });

  chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScZActXpbHjAZf1Qi5BsOCy8HN74oXSlKEZSccNdfzDrLRGSA/viewform");
  
  
  
  
  
  
  
  
   
   		var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'AW-796233903']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
