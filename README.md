# Spam Email Classifier


## Backend

- Flask API đơn giản xử lý phân loại email spam/ham
- Sử dụng mô hình Naive Bayes được huấn luyện từ dữ liệu spam.csv
- API endpoint: `/predict` (POST) - nhận email và trả về kết quả phân loại

## Naive Bayes

Mô hình sử dụng thuật toán Multinomial Naive Bayes để phân loại email:

- **Nguyên lý:** Áp dụng định lý Bayes với giả định độc lập giữa các đặc trưng (từ ngữ)
- **Ưu điểm:** Hiệu quả với dữ liệu văn bản, đơn giản, huấn luyện nhanh
- **Xử lý dữ liệu:** Chuyển đổi email thành vector đặc trưng sử dụng CountVectorizer
- **Kết quả:** Trả về nhãn (spam/ham) và độ tin cậy của dự đoán

## Cài đặt

```
git clone https://github.com/F3ust/AI_INTRO_20242.git 
cd AI_INTRO_20242/backend
pip install -r requirements.txt
```


## Chạy backend

```
python app.py
```
Backend sẽ chạy trên port 42069

## Cài đặt Extension

1. Mở Chrome/Edge, vào trang `chrome://extensions/`
2. Bật "Developer mode"
3. Chọn "Load unpacked" và chọn thư mục `spam_classifier_extension`
