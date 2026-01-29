# SentimentPulse (Sprints 1-2)

Ce dépôt contient le socle technique du projet SentimentPulse couvrant les deux premiers sprints du MVP : backend FastAPI (auth + import CSV + analyse VADER) et frontend React (dashboard minimal).

## Structure

- `backend/` — API FastAPI, stockage SQLModel/SQLite, endpoints JWT + analyse.
- `frontend/` — PWA React/Vite avec dashboard, login, import CSV.
- `docs/` — backlog produit et diagramme de cas d'utilisation.

## Lancer localement

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

Le frontend suppose que l'API tourne sur `http://localhost:8000/api` (configurable via `VITE_API_URL`).

## Fonctionnalités livrées (S1-S2)

- Authentification JWT (inscription, login, profil).
- Import CSV d'avis + analyse automatique (VADER + extraction simple).
- API Dashboard: agrégats & derniers avis.
- Interface React: login, visualisation graphique (Recharts), formulaire d'avis, import CSV.
- Documentation: backlog MVP + diagramme de cas d'utilisation global.


