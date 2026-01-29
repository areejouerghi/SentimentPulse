from transformers import pipeline

# Load the model used in services.py
print("Loading model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

test_sentences = [
    ("English Positive", "I love this product, it is amazing!"),
    ("English Negative", "This is the worst experience I have ever had."),
    ("French Positive", "J'adore ce produit, il est incroyable !"),
    ("French Negative", "C'est la pire expérience que j'ai jamais av eue."),
    ("French Mixed", "C'est pas mal mais pourrait être mieux.")
]

print("\n--- Testing Sentiment Analysis ---")
for lang, text in test_sentences:
    result = sentiment_pipeline(text)[0]
    print(f"[{lang}] Text: '{text}'")
    print(f"Result: {result['label']} (Score: {result['score']:.4f})\n")
