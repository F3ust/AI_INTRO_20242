# Email Spam Classifier Extension v2.0

Extension Chrome để phân loại email spam và phân tích tần suất từ khóa với đồ thị trực quan.

## Tính năng mới

### 1. Phân loại Spam (như cũ)
- Nhập nội dung email và nhận kết quả phân loại spam/ham
- Hiển thị độ tin cậy của prediction

### 2. Phân tích Tần suất Từ khóa (MỚI)
- **Input**: 
  - Số từ trong đoạn văn giả định (ví dụ: 20 từ)
  - Từ hoặc cụm từ cần phân tích (ví dụ: "free", "money", "winner")
  - Đoạn văn cơ sở (tùy chọn)
- **Output**: 
  - Đồ thị đường hiển thị mối quan hệ giữa số lần xuất hiện từ và % confidence spam
  - Trục hoành (x): Số lần từ đó xuất hiện (n = 0, 1, 2, ...)  
  - Trục tung (y): % confidence của model về khả năng spam

## Cài đặt

### Yêu cầu
- Node.js và npm
- Chrome browser
- Backend server chạy trên port 42069

### Bước 1: Build Extension
```bash
# Chạy script build
./build.bat

# Hoặc manual:
npm install
npm run build
```

### Bước 2: Load Extension vào Chrome
1. Mở Chrome và vào `chrome://extensions/`
2. Bật "Developer mode"
3. Click "Load unpacked"
4. Chọn thư mục `spam_classifier_extension`

### Bước 3: Khởi động Backend
```bash
# Từ thư mục gốc dự án
python app.py
```

## Cách sử dụng

### Tab "Phân loại Spam"
1. Nhập nội dung email vào text area
2. Click "Kiểm tra"
3. Xem kết quả phân loại và độ tin cậy

### Tab "Phân tích Tần suất"
1. Nhập số từ cho đoạn văn giả định (ví dụ: 20)
2. Nhập từ khóa cần phân tích (ví dụ: "free")
3. (Tùy chọn) Nhập đoạn văn cơ sở
4. Click "Phân tích"
5. Xem đồ thị hiển thị mối quan hệ giữa tần suất từ và confidence spam

## Ví dụ sử dụng Phân tích Tần suất

**Kịch bản**: Muốn xem từ "free" ảnh hưởng như thế nào đến khả năng email được coi là spam

**Input**:
- Số từ: 15
- Từ khóa: "free" 
- Đoạn văn cơ sở: "Hello this is a normal email message"

**Kết quả**: Đồ thị sẽ hiển thị:
- Điểm (0, y1): Không có từ "free" → confidence spam = y1%
- Điểm (1, y2): Có 1 lần từ "free" → confidence spam = y2%
- Điểm (2, y3): Có 2 lần từ "free" → confidence spam = y3%
- ...

## Cấu trúc dự án

```
spam_classifier_extension/
├── src/
│   ├── types.ts          # Type definitions
│   ├── api.ts           # API service
│   ├── chart.ts         # Chart utilities
│   ├── popup.ts         # Main popup logic
│   ├── content.ts       # Content script
│   └── background.ts    # Background script
├── dist/                # Built files
├── images/              # Extension icons
├── manifest.json        # Extension manifest
├── popup.html          # Popup UI
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── webpack.config.js   # Build config
└── README.md           # This file
```

## API Endpoints

### Backend đã được cập nhật với endpoint mới:

- `POST /predict` - Phân loại spam (cũ)
- `POST /analyze_word_frequency` - Phân tích tần suất từ (mới)

## Lưu ý

- Extension sử dụng Chart.js từ CDN để vẽ đồ thị
- Backend server phải chạy trên localhost:42069
- Extension được viết hoàn toàn bằng TypeScript
- Hỗ trợ manifest v3 của Chrome 