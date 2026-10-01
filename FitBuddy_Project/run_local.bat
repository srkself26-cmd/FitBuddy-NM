@echo off
python -m venv fitbuddy-env
call fitbuddy-env\Scripts\activate
pip install -r requirements.txt
if not exist .env copy .env.example .env
echo Edit .env and set GOOGLE_API_KEY before first AI request.
uvicorn app.main:app --reload
