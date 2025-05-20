document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('checkBtn');
  const emailContent = document.getElementById('emailContent');
  const resultDiv = document.getElementById('result');
  
  // Lấy nội dung từ email đang mở nếu đang ở Gmail
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: getEmailContent
    }, (results) => {
      if (results && results[0] && results[0].result) {
        emailContent.value = results[0].result;
      }
    });
  });
  
  // Xử lý sự kiện khi nhấn nút kiểm tra
  checkBtn.addEventListener('click', function() {
    const text = emailContent.value.trim();
    
    if (text.length === 0) {
      alert('Please enter email content!');
      return;
    }
    
    // Gửi request đến API Flask
    fetch('http://localhost:42069/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text: text})
    })
    .then(response => response.json())
    .then(data => {
      resultDiv.classList.remove('hidden', 'spam', 'ham');
      
      if (data.is_spam) {
        resultDiv.classList.add('spam');
        resultDiv.textContent = `SPAM (Confidence: ${Math.round(data.confidence * 10000)/100}%)`;
      } else {
        resultDiv.classList.add('ham');
        resultDiv.textContent = `NOT SPAM (Confidence: ${Math.round(data.confidence * 10000)/100}%)`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.classList.remove('hidden', 'spam', 'ham');
      resultDiv.textContent = 'Error connecting to server. Ensure Flask API is running. Port: 42069';
    });
  });
});

function getEmailContent() {
  try {

    const bodyElements = document.querySelectorAll('.a3s.aiL');
    if (bodyElements.length > 0) {
      return bodyElements[0].innerText;
    }
    
    return '';
  } catch (e) {
    console.error('Error getting email content:', e);
    return '';
  }
} 