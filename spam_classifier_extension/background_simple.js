// BG script for Chrome ext
console.log('Spam Classifier Ext BG loaded');

// Handle ext install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome ext installed');
});

// Handle tab updates  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('mail.google.com')) {
    console.log('Gmail tab loaded');
  }
}); 