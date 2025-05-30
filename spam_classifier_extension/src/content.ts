// Gmail content script
console.log('Spam Classifier Extension loaded on Gmail');

// Get email content from Gmail
function getEmailContent(): string {
  // Gmail selectors
  const selectors = [
    '.ii.gt .a3s.aiL',  // Std email content
    '.ii.gt .a3s',      // Alt selector
    '[role="listitem"] .a3s.aiL', // Another Gmail selector
    '.a3s.aiL'          // Fallback
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.textContent) {
      return element.textContent.trim();
    }
  }

  return '';
}

// Listen for popup msgs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailContent') {
    const content = getEmailContent();
    sendResponse({ content });
  }
});

export {}; 