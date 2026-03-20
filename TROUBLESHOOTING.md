# Troubleshooting Guide — Reference this when errors occur

## Node.js / npm errors

### "digital envelope routines::initialization error"
Fix: Run with `NODE_OPTIONS=--openssl-legacy-provider` environment variable.
This happens with older webpack/react-scripts on Node 18+.

### "EACCES permission denied"
Fix: Don't use sudo for npm. If needed: `npm config set prefix ~/.npm-global` and add to PATH.

### "ENOSPC: no space left on device" or "ENOMEM"
Fix: This is a small EC2 instance. Reduce dependencies. Don't install dev dependencies you don't need.
Run: `npm install --production` if you only need runtime deps.

### "peer dependency conflict"
Fix: Use `npm install --legacy-peer-deps`. This is almost always safe.

### "Module not found" after install
Fix: Check that the import path matches the package name exactly. Check package.json has the dependency listed.

## React / Vite errors

### Vite dev server not accessible externally
Fix: Add to vite.config.js:
```js
export default defineConfig({
  server: { host: true, port: 3000 }
})
```

### CRA "react-scripts: not found"
Fix: Run `npm install` first. If still broken: `npx react-scripts start`.

### Blank page in browser
Fix: Check browser console. Usually a JavaScript error. Common causes:
- Import path wrong (case sensitive on Linux!)
- Environment variable not set (process.env.REACT_APP_*)
- Router basename wrong

## Python errors

### "No module named X"
Fix: `pip3 install X` or `python3 -m pip install X`.

### Flask/Django not accessible externally
Fix: Bind to 0.0.0.0, not 127.0.0.1.
Flask: `app.run(host='0.0.0.0', port=3000)`
Django: `python manage.py runserver 0.0.0.0:3000`

## Git errors

### "fatal: not a git repository"
Fix: Make sure you're in /home/ec2-user/repo.

### "Permission denied (publickey)"
Fix: The repo URL should use the token-based HTTPS URL, not SSH.

## General

### Port already in use
Fix: `kill $(lsof -t -i:3000)` then try again.

### Command not found
Fix: Check PATH. Common locations: /usr/local/bin, /usr/bin, ./node_modules/.bin
