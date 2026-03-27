# Project Templates — Use these as starting patterns

## Static Website
Best for: portfolios, landing pages, documentation, simple tools
```
index.html
style.css
script.js
```
Always include viewport meta tag. Use modern CSS (flexbox/grid). No build step needed.

## React App (Vite)
Best for: interactive web apps, dashboards, SPAs
```bash
npx create-vite@latest . --template react --yes
```
Then edit vite.config.js to add: `server: { host: true, port: 3000 }`

## Express API
Best for: REST APIs, webhooks, backend services
```bash
npm init -y
npm install express cors
```
Create index.js with basic Express server on port 3000, binding to 0.0.0.0.

## Python Flask API
Best for: simple APIs, data processing endpoints
```bash
pip3 install flask flask-cors
```
Create app.py with Flask server on port 3000, host 0.0.0.0.

## Full-Stack (React + Express)
Best for: apps needing a frontend and API
Structure:
```
/client  — React app (Vite)
/server  — Express API
```
Use concurrently or separate ports (3000 for API, 5173 for frontend).

## Static Site Generator
Best for: blogs, documentation sites
Use a simple approach — generate HTML files from markdown using a script, then serve statically.
Don't use heavy frameworks like Gatsby/Hugo unless specifically asked.
