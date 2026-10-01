#!/usr/bin/env bash
set -e
python -m venv fitbuddy-env
source fitbuddy-env/bin/activate
pip install -r requirements.txt
cp -n .env.example .env || true
echo "Edit .env and set GOOGLE_API_KEY before first AI request."
uvicorn app.main:app --reload
