from datetime import datetime
from io import StringIO
from typing import List, Tuple

import pandas as pd
import spacy
from sqlmodel import Session, select
from transformers import pipeline

from .models import Review

# Load ML Models (Global caching)
# Sentiment analysis using multilingual BERT
# Supports English, French, Spanish, German, Chinese, etc.
print("Loading Sentiment Model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# Entity extraction using Spacy
print("Loading Spacy Model...")
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Spacy model not found. Downloading...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def classify_sentiment(text: str) -> Tuple[str, float]:
    """
    Uses HuggingFace Transformers (Multilingual BERT) to predict sentiment.
    Returns (label, score).
    """
    # Truncate text to 512 tokens approx (BERT limit)
    truncated_text = text[:512] 
    result = sentiment_pipeline(truncated_text)[0]
    
    # Model returns labels like "1 star", "2 stars", ... "5 stars"
    raw_label = result["label"]
    score = result["score"]
    
    # Extract the number of stars
    try:
        stars = int(raw_label.split()[0])
    except (ValueError, IndexError):
        # Fallback if format changes
        return "neutral", 0.0

    if stars <= 2:
        final_label = "negative"
    elif stars == 3:
        final_label = "neutral"
    else:
        final_label = "positive"

    return final_label, round(score, 4)


def extract_entities(text: str) -> str:
    """
    Uses Spacy to extract named entities (ORG, GPE, PERSON, PRODUCT).
    """
    doc = nlp(text)
    # Filter for relevant entity types
    relevant_labels = {"ORG", "GPE", "PERSON", "PRODUCT"}
    entities = [ent.text for ent in doc.ents if ent.label_ in relevant_labels]
    # Deduplicate and join
    unique_entities = sorted(set(entities))
    return ", ".join(unique_entities[:10])


def analyze_review(review: Review) -> Review:
    label, score = classify_sentiment(review.content)
    review.sentiment = label
    review.sentiment_score = score
    review.key_entities = extract_entities(review.content)
    review.analyzed_at = datetime.utcnow()
    return review


def bulk_import_reviews(session: Session, csv_content: str, owner_id: int) -> int:
    buffer = StringIO(csv_content)
    df = pd.read_csv(buffer)
    required_cols = {"content"}
    if not required_cols.issubset(df.columns):
        raise ValueError("CSV must contain at least a 'content' column")

    new_reviews: List[Review] = []
    for _, row in df.iterrows():
        review = Review(
            source=row.get("source", "csv"),
            author=row.get("author"),
            content=row["content"],
            owner_id=owner_id,
        )
        analyze_review(review)
        new_reviews.append(review)

    session.add_all(new_reviews)
    session.commit()
    return len(new_reviews)


def get_dashboard_summary(session: Session, owner_id: int, limit: int = 5) -> Tuple[dict, List[Review]]:
    statement = select(Review).where(Review.owner_id == owner_id).order_by(Review.created_at.desc())
    reviews: List[Review] = session.exec(statement).all()
    total = len(reviews)
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    for review in reviews:
        # Normalize labels just in case
        sentiment = review.sentiment.lower() if review.sentiment else "neutral"
        if sentiment in sentiment_counts:
            sentiment_counts[sentiment] += 1
        else:
            # Handle unknown labels by mapping them or ignoring
            pass
            
    sentiment_counts["total"] = total
    return sentiment_counts, reviews[:limit]


def get_form_stats(session: Session, form_id: int, limit: int = 50) -> Tuple[dict, List[Review]]:
    statement = select(Review).where(Review.form_id == form_id).order_by(Review.created_at.desc())
    reviews = session.exec(statement).all()
    
    total = len(reviews)
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    for review in reviews:
        sentiment = review.sentiment.lower() if review.sentiment else "neutral"
        if sentiment in sentiment_counts:
            sentiment_counts[sentiment] += 1
            
    sentiment_counts["total"] = total
    return sentiment_counts, reviews[:limit]
