# Email Spam Classifier with Word Frequency Analysis

## 1. Giới thiệu Project

### Input/Output
**Input:**
- **Spam Classification**: Nội dung email dưới dạng text
- **Word Frequency Analysis**: 
  - Số từ trong đoạn văn giả định (1-100)
  - Từ/cụm từ cần phân tích
  - Đoạn văn cơ sở (tùy chọn)

**Output:**
- **Spam Classification**: 
  - Nhãn phân loại (SPAM/HAM)
  - Độ tin cậy (confidence %)
- **Word Frequency Analysis**:
  - Đồ thị mối quan hệ giữa tần suất từ và confidence spam
  - Dữ liệu chi tiết từng điểm (n lần xuất hiện → % confidence)

### Cách triển khai
- **Backend**: Flask API với ML model (Naive Bayes)
- **Frontend**: Chrome Extension được viết bằng TypeScript
- **Architecture**: Client-Server model với REST API
- **Data flow**: Extension → Flask API → ML Model → JSON Response → Extension UI

## 2. Giới thiệu Bài toán

### Bài toán chính
Phân loại email spam/ham tự động sử dụng machine learning để giúp người dùng:
- Nhận diện email spam nhanh chóng
- Hiểu được tác động của các từ khóa đối với việc phân loại spam

### Bài toán mở rộng
Phân tích mối quan hệ giữa tần suất xuất hiện của từ khóa và khả năng email bị coi là spam:
- **Câu hỏi**: Từ "free" xuất hiện bao nhiêu lần trong email thì khả năng bị coi là spam tăng?
- **Ứng dụng**: Giúp hiểu behavior của model và tối ưu nội dung email

### Thách thức
- Xử lý text không chuẩn hóa
- Cân bằng giữa độ chính xác và tốc độ
- Visualization kết quả trong môi trường Chrome Extension (CSP limitations)

## 3. Hướng đi/Ý tưởng

### Approach 1: Spam Classification
- Sử dụng dataset có sẵn (spam.csv) với ~5000 emails đã được label
- Áp dụng thuật toán Naive Bayes cho text classification
- Preprocessing: Chuyển đổi text thành feature vectors bằng CountVectorizer

### Approach 2: Word Frequency Impact Analysis
- **Ý tưởng**: Tạo synthetic text với số lần xuất hiện từ khóa khác nhau
- **Method**: 
  1. Tạo đoạn văn base với n từ
  2. Thay thế k từ bằng target keyword (k = 0, 1, 2, ...)
  3. Chạy prediction cho từng variation
  4. Visualize mối quan hệ n → confidence

### Extension Integration
- **Chrome Extension**: Cung cấp UI/UX thân thiện
- **Real-time Analysis**: Tích hợp với Gmail để phân tích email trực tiếp
- **Visualization**: Text-based charts (do CSP restrictions)

## 4. Thuật toán Áp dụng

### Multinomial Naive Bayes
**Lý do lựa chọn:**
- Hiệu quả cao với text classification
- Training nhanh, inference nhanh
- Xử lý tốt high-dimensional sparse data
- Robust với noise trong text

**Công thức tính:**
```
P(spam|text) = P(text|spam) × P(spam) / P(text)

Với:
- P(spam|text): Xác suất email là spam given text content
- P(text|spam): Likelihood của text content given class spam
- P(spam): Prior probability của class spam
- P(text): Evidence (normalization factor)
```

**Feature Engineering:**
- **CountVectorizer**: Chuyển text thành bag-of-words vectors
- **Vocabulary**: Tự động extract từ training data
- **Normalization**: Lowercase, remove special characters

**Training Process:**
1. Load spam.csv dataset (ham=0, spam=1)
2. Split text thành words và tạo vocabulary
3. Transform text thành count vectors
4. Fit Naive Bayes model
5. Save model và vectorizer bằng joblib

## 5. Giải thích Đầu ra

### Spam Classification Output
```json
{
  "is_spam": true,
  "confidence": 0.856,
  "label": "spam"
}
```
- **is_spam**: Boolean decision (True/False)
- **confidence**: Xác suất của prediction (0.0-1.0)
- **label**: Human-readable label ("spam"/"ham")

### Word Frequency Analysis Output
```json
{
  "results": [
    {"n": 0, "confidence": 23.5, "text_preview": "Hello this is normal..."},
    {"n": 1, "confidence": 45.2, "text_preview": "free Hello this is..."},
    {"n": 2, "confidence": 67.8, "text_preview": "free free Hello this..."}
  ],
  "target_word": "free",
  "word_count": 20
}
```

**Interpretation:**
- **n**: Số lần từ khóa xuất hiện trong text
- **confidence**: % xác suất bị coi là spam
- **text_preview**: Sample text được tạo ra
- **Pattern Analysis**: 
  - n=0 → 23.5%: Text bình thường có confidence thấp
  - n=1 → 45.2%: Xuất hiện 1 lần "free" tăng confidence
  - n=2 → 67.8%: Tần suất cao hơn → confidence cao hơn

### Visual Output
Text-based chart hiển thị:
```
n=0: ████████░░ 23.5%
n=1: ████████████░░ 45.2%  
n=2: ████████████████░░ 67.8%
```

**Insights:**
- Từ khóa như "free", "money", "winner" thường có impact mạnh
- Relationship thường là non-linear (không phải cứ thêm từ là tăng tuyến tính)
- Saturation effect: Sau một threshold, thêm từ không tăng confidence nhiều

## 6. Hướng dẫn chạy Project

### 6.1. Yêu cầu môi trường
- Python 3.8+
- pip
- Node.js và npm (cho extension)
- Chrome browser (để sử dụng extension)

### 6.2. Clone và cài đặt project
```bash
# Clone repository
git clone https://github.com/F3ust/AI_INTRO_20242.git
cd AI_INTRO_20242
```

### 6.3. Cài đặt và chạy backend (Flask API)
```bash
cd backend

pip install -r requirements.txt

python app.py
```
- API sẽ chạy tại `http://localhost:42069`
- Console sẽ hiển thị: "Running on http://0.0.0.0:42069"

### 6.4. Build và cài đặt Chrome Extension
```bash
cd spam_classifier_extension
npm install
npm run build

```

**Cài đặt extension vào Chrome:**
1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode" (Chế độ dành cho nhà phát triển)
3. Click "Load unpacked" (Tải tiện ích đã giải nén)
4. Chọn thư mục `spam_classifier_extension/dist/`
5. Extension "Email Spam Classifier" sẽ xuất hiện trên thanh công cụ

### 6.5. Sử dụng extension
**Spam Classification:**
1. Click vào icon extension trên thanh Chrome
2. Tab "Spam Classification" → Nhập nội dung email
3. Click "Check" → Xem kết quả (SPAM/HAM + confidence %)

**Word Frequency Analysis:**
1. Chuyển sang tab "Word Frequency Analysis"
2. Nhập:
   - Number of words: 20 (ví dụ)
   - Word/phrase to analyze: "free" (ví dụ)
   - Base text: "Hello this is a normal email message" (tùy chọn)
3. Click "Analyze" → Xem chart hiển thị mối quan hệ n → confidence


**Kiểm tra hoạt động:**
```bash
# Test API backend
curl -X POST http://localhost:42069/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "FREE money click here NOW!!!"}'

# Kết quả mong đợi:
# {"confidence": 0.95, "is_spam": true, "label": "spam"}
```

