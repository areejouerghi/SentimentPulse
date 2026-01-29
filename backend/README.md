# SentimentPulse Backend

FastAPI backend covering Sprint 1 & 2 scope (auth, CSV import, baseline NLP, dashboard API).

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs on `http://127.0.0.1:8000`. Interactive docs available at `/docs`.

## Environment

Set the following variables (or create `.env`):

```
APP_NAME=SentimentPulse API
API_PREFIX=/api
JWT_SECRET_KEY=change-me
DATABASE_URL=sqlite:///./sentimentpulse.db
```

## Included endpoints

- `POST /api/auth/register` register user
- `POST /api/auth/login` issue JWT
- `GET /api/auth/me` current profile
- `POST /api/reviews/` add manual review (auto sentiment + keywords)
- `POST /api/reviews/import` upload CSV (`content` column) for batch analysis
- `GET /api/reviews/` list reviews
- `GET /api/dashboard/` aggregated counts + latest reviews

All review & dashboard routes require `Authorization: Bearer <token>`.


