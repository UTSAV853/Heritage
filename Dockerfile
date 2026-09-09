# Smart Heritage Conservation Platform — Multi-stage Dockerfile

# ── Stage 1: Build React frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python backend ────────────────────────────────────────────────────
FROM python:3.12-slim AS production
WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend source
COPY backend/ ./

# Frontend build output (served by FastAPI static files in production)
COPY --from=frontend-build /app/frontend/dist ./static

# Non-root user
RUN useradd -m -u 1001 heritage && chown -R heritage:heritage /app
USER heritage

# Environment defaults
ENV APP_ENV=production
ENV DATABASE_URL=sqlite:///./heritage.db
ENV CORS_ORIGINS=http://localhost:8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
