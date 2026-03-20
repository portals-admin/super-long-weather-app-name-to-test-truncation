# Agent Instructions — READ THIS FIRST

You are a coding agent on a cloud server. A user watches your progress on their phone in real-time. Your output MUST work — the user will try to preview it immediately.

## CRITICAL RULES

### 1. VERIFY YOUR WORK BEFORE FINISHING
- After writing all files, run the project to make sure it works
- For web projects: run npm install and npm run dev (or python3 -m http.server) and verify no errors
- If npm install fails, FIX IT. Read the error, fix package.json, try again. Do not leave broken code.
- If the dev server crashes on start, FIX IT. Read the error, fix the config, try again.

### 2. CHOOSE THE SIMPLEST APPROACH
- Simple website/landing page/portfolio → plain HTML + CSS + JS. NO frameworks. Just index.html.
- Interactive web app explicitly requesting React → use Vite with React template
- API/backend → Express or Flask, keep it minimal

### 3. FOR REACT/VITE PROJECTS — DO THIS EXACTLY
If you must use React, follow these steps in order:
1. Run: npx create-vite@latest . --template react -- --yes (in the repo directory)
2. Run: npm install (verify it succeeds with exit code 0)
3. Edit vite.config.js to add: server: { host: true, port: 3000 }
4. Make your code changes
5. Run: npm run dev (verify the server starts without errors)
6. If ANYTHING fails, read the error and fix it before moving on

### 4. FOR NEXT.JS PROJECTS — DO THIS EXACTLY
1. Run: npx create-next-app@latest . --yes --no-git
2. Run: npm install
3. Make your code changes
4. Run: npm run dev (verify it starts)

### 5. MOBILE-FIRST PREVIEW
The user views your work on a phone browser via http://EC2_IP:3000
- Every HTML file MUST have: <meta name="viewport" content="width=device-width, initial-scale=1">
- Use responsive CSS — no fixed widths over 400px
- Use relative paths for everything — no localhost URLs in your code
- Make it look good on a small screen

### 6. GITIGNORE — ALWAYS CREATE THIS
For any Node project, create a .gitignore BEFORE running npm install:
```
node_modules/
dist/
build/
.next/
.env
```

### 7. COMMON MISTAKES TO AVOID
- Do NOT create package.json manually — use npm init or create-vite/create-next-app
- Do NOT use TypeScript unless the user specifically asks for it
- Do NOT leave import errors — if you import something, make sure the file exists
- Do NOT use environment variables that are not set
- Do NOT create files outside the repo directory
- If you scaffold with create-vite, do NOT delete the generated files and recreate them — edit them
- Always check: does package.json have a valid "scripts" section with "dev" or "start"?

### 8. DEBUGGING
If something does not work:
- Read the error message carefully
- Fix the root cause, do not add workarounds
- Run the command again to verify the fix
- Repeat until it works — do not give up after one attempt
