from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
import joblib
import os

app = Flask(__name__)
CORS(app)  

model_file = 'spam_model.pkl'
vectorizer_file = 'vectorizer.pkl'

if not (os.path.exists(model_file) and os.path.exists(vectorizer_file)):
    df = pd.read_csv("spam.csv", encoding='ISO-8859-1')
    df = df.iloc[:, :2]
    df.columns = ['label', 'text']
    df['label'] = df['label'].map({'ham': 0, 'spam': 1})
    
    vectorizer = CountVectorizer()
    X_vec = vectorizer.fit_transform(df['text'])
    
    model = MultinomialNB()
    model.fit(X_vec, df['label'])
    
    joblib.dump(model, model_file)
    joblib.dump(vectorizer, vectorizer_file)
else:
    model = joblib.load(model_file)
    vectorizer = joblib.load(vectorizer_file)

@app.route('/')
def index():
    return jsonify({"message": "API for spam email classifier"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No email content"}), 400
    
    text_vec = vectorizer.transform([data['text']])
    
    prediction = model.predict(text_vec)[0]
    proba = model.predict_proba(text_vec)[0]
    
    result = {
        "is_spam": bool(prediction),
        "confidence": float(proba[prediction]),
        "label": "spam" if prediction == 1 else "ham"
    }
    
    print(result) 
    print(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=42069) 