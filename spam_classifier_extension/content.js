
console.log('Email Spam Classifier Extension đang hoạt động');

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      const emailRows = document.querySelectorAll('tr.zA');
    } 
  });
});


const config = { childList: true, subtree: true };
observer.observe(document.body, config);

