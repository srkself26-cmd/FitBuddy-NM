# Upload FitBuddy to GitHub

## 1. Create a GitHub repository
Create an empty repository named `FitBuddy`.

## 2. Open the submission folder in VS Code
Open `FitBuddy_GitHub_Submission`.

## 3. Initialize Git

```bash
git init
git add .
git commit -m "Initial FitBuddy AI fitness project"
git branch -M main
```

## 4. Connect your repository

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 5. Check secrets
Before pushing, run:

```bash
git status
```

Make sure `.env` is not listed. Only `.env.example` should be committed.
