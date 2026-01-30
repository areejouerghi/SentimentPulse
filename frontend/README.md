# SentimentPulse Frontend

React (Vite) Progressive Web App covering Sprint 1-2 scope (auth, dashboard, CSV import).

## Install

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` if backend is not running on `http://localhost:8000/api`.

## Features

- JWT login form
- Dashboard with sentiment pie chart & latest reviews
- Manual review entry + automatic NLP
- CSV import (content column) triggering backend analysis


