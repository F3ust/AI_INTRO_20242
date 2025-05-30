from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
import joblib
import os
import re

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

@app.route('/analyze_word_frequency', methods=['POST'])
def analyze_word_frequency():
    data = request.get_json()
    if not data or 'word_count' not in data or 'target_word' not in data:
        return jsonify({"error": "Missing word_count or target_word"}), 400
    
    word_count = int(data['word_count'])
    target_word = data['target_word'].lower()
    base_text = data.get('base_text', 'This is a sample email message.')
    
    # Create base text if not provided
    if not base_text.strip():
        base_text = 'This is a sample email message.'
    
    # Create list of base words to build paragraphs
    base_words = base_text.split()
    
    results = []
    
    for n in range(0, min(word_count + 1, 50)):
        if n == 0:
            multiplier = (word_count // len(base_words)) + 1
            extended_base = base_words * multiplier
            current_words = extended_base[:word_count]
        else:
            remaining_words = max(0, word_count - n)
            
            target_words = [target_word] * n
            
            if remaining_words > 0:
                # Fill remaining space with base words
                multiplier = (remaining_words // len(base_words)) + 1
                base_fill = (base_words * multiplier)[:remaining_words]
                current_words = target_words + base_fill
            else:
                current_words = target_words
        
        current_text = ' '.join(current_words)
        
        # Predict spam probability
        text_vec = vectorizer.transform([current_text])
        proba = model.predict_proba(text_vec)[0]
        spam_confidence = float(proba[1]) * 100
        
        print(f"n={n}, text_length={len(current_words)}, confidence={spam_confidence:.2f}%")
        print(f"Text preview: {current_text[:50]}...")
        
        results.append({
            'n': n,
            'confidence': spam_confidence,
            'text_preview': current_text[:100] + '...' if len(current_text) > 100 else current_text
        })
    
    return jsonify({
        'results': results,
        'target_word': target_word,
        'word_count': word_count
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=42069) 