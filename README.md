<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bbe00252-535f-4e24-8390-976f5432bb93

## Run Locally

**Prerequisites:**  Node.js 20.9 or newer


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run as a Service

The app runs on the Next.js server (`next start`), not as a static export.

1. Build the app:
   `npm install && npm run build`
2. Install and start the service (edit `User`, `WorkingDirectory` and the node path in [deploy/giti.service](deploy/giti.service) if they differ on your server):
   ```
   sudo cp deploy/giti.service /etc/systemd/system/giti.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now giti
   ```
3. Check it:
   `systemctl status giti` and `journalctl -u giti -f`

The service listens on port 3000; change `PORT` in the unit file to use another port. After deploying new code, run `npm run build` and `sudo systemctl restart giti`.
