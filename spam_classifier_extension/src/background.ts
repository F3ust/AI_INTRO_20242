// BG script for Chrome ext
console.log('Spam Classifier Ext BG loaded');

// Handle ext install
self.addEventListener('install', () => {
  console.log('Spam Classifier Ext installed');
});

// Listen for Chrome runtime events
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Chrome ext installed');
  });

  if (chrome.tabs) {
    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === 'complete' && tab.url?.includes('mail.google.com')) {
        console.log('Gmail tab loaded');
      }
    });
  }
}

export {}; 