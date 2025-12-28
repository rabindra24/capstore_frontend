# Deployment Guide for VirtuWork Frontend

## Overview
This frontend is a React SPA (Single Page Application) built with Vite. It requires proper server configuration to handle client-side routing.

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. The `vercel.json` file is already configured

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. The `netlify.toml` and `public/_redirects` files are already configured

### Apache Server
1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your server
3. The `.htaccess` file in the `public` folder will be copied to `dist` automatically
4. Ensure `mod_rewrite` is enabled on your Apache server

### Nginx
Add this to your nginx configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Other Static Hosts
For any static hosting service, ensure all routes redirect to `/index.html` with a 200 status code.

## Environment Variables

Create a `.env` file in the frontend directory with:

```env
VITE_SERVER_URL=https://your-backend-url.com
```

Replace `https://your-backend-url.com` with your actual backend API URL.

## Build Command

```bash
npm install
npm run build
```

The build output will be in the `dist` folder.

## Important Notes

1. **404 Route**: The app has a custom 404 page that will show for non-existent routes
2. **Public Assets**: Files in the `public` folder (like `_404.gif`) are served from the root path
3. **Environment Variables**: All environment variables must be prefixed with `VITE_`
4. **Base Path**: If deploying to a subdirectory, update the `base` option in `vite.config.ts`
