import requests
import json

# URL của API Flask
url = "http://localhost:5000/predict"

# Mẫu email thử nghiệm
test_email_spam = "Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121 to receive entry question(std txt rate)T&C's apply 08452810075over18's"
test_email_ham = "Ok lar... Joking wif u oni..."

# Hàm gửi request tới API
def test_email(email_content):
    headers = {'Content-Type': 'application/json'}
    data = {'text': email_content}
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            result = response.json()
            print(f"Nội dung: {email_content[:50]}...")
            print(f"Kết quả: {result['label']} (Độ tin cậy: {result['confidence']*100:.2f}%)")
            print("-" * 50)
        else:
            print(f"Lỗi: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Lỗi kết nối: {e}")
        print("Hãy đảm bảo API Flask đang chạy (python app.py hoặc python app_simple.py)")

if __name__ == "__main__":
    print("Kiểm tra API phân loại email spam")
    print("=" * 50)
    
    print("Kiểm tra email spam:")
    test_email(test_email_spam)
    
    print("\nKiểm tra email ham:")
    test_email(test_email_ham)
    
    # Cho phép người dùng nhập email để kiểm tra
    print("\nNhập nội dung email để kiểm tra (nhấn Enter để kết thúc):")
    user_email = input("> ")
    if user_email:
        test_email(user_email) 