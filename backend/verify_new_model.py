from transformers import pipeline

model_name = "lxyuan/distilbert-base-multilingual-cased-sentiments-student"
print(f"Loading model {model_name}...")
sentiment_pipeline = pipeline("sentiment-analysis", model=model_name)

test_sentences = [
    ("English Positive", "I love this product, it is amazing!"),
    ("English Negative", "This is the worst experience I have ever had."),
    ("French Positive", "J'adore ce produit, il est incroyable !"),
    ("French Negative", "C'est la pire expérience que j'ai jamais av eue."),
    ("French Mixed", "C'est pas mal mais pourrait être mieux.")
]

print("\n--- Testing Multilingual Sentiment Analysis ---")
for lang, text in test_sentences:
    result = sentiment_pipeline(text)[0]
    print(f"[{lang}] Text: '{text}'")
    print(f"Result: {result['label']} (Score: {result['score']:.4f})\n")
