# Throne of Glass — Tandem Reading Tracker

A mobile-first, local-only progress tracker for the 50-section *Empire of Storms* / *Tower of Dawn* tandem read. No account, backend, or paid service is needed.

## Reading order

The 50 entries were checked against [T.L. Branson’s published guide](https://www.tlbranson.com/throne-of-glass-tandem-read/) on 2026-10-08. Sections 31 (EOS chapters 33–51) and 49 (EOS chapters 68–75) are intentionally long in the original. Section 50 is worded “Chapter 58 through Fireheart” here; the guide writes “Chapter 58–Fireheart.” No sequence changes were needed.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The development server binds to `127.0.0.1` and is not intended for public access.

```sh
npm test
npm run build
```

`dist/` is the static production site. The app works without the Google fonts connection, using installed fallback fonts.

## Progress, backup, and restore

Check any section in any order. Progress is stored in this browser’s `localStorage` under `tog-tandem-progress-v1`, using stable section IDs. It persists across reloads and browser restarts on the same device and browser. Browser data deletion or private browsing may erase it. It does not sync across devices.

Use **Export progress** to save a small JSON file. To move to another device or browser, open the site there and use **Import progress**. The file is validated and you must confirm before existing progress is replaced. **Reset progress** also requires confirmation. Backups contain only a schema version and completed IDs, with no personal information. Keep your last export before upgrades or browser cleanup.

Because browser storage is tied to the site’s origin, changing the hostname, scheme (`http` to `https`), or port creates a separate progress store. Export and import to migrate between origins. This matters when switching from a local Pi address to a Cloudflare domain.

## Raspberry Pi deployment

The Docker image uses multi-stage Node and Nginx builds and supports ARM64. Copy this project to your Raspberry Pi, then from its directory run:

```sh
docker compose up -d --build
```

The default Compose file binds the site to **127.0.0.1:8086** on the Pi. Visit `http://127.0.0.1:8086` on the Pi to verify it. If port 8086 is already used, change only the host-side port in `docker-compose.yml`. This setup does not alter or expose other apps.

For outside access, point your existing Cloudflare Tunnel or reverse proxy at `http://127.0.0.1:8086` on the Pi and assign a hostname such as `reading.yourdomain.com`. In Cloudflare Zero Trust, this is a public hostname with HTTP service type and the local target above. If the tunnel runs in another Docker container, `127.0.0.1` inside that container refers to itself; instead put both services on a shared Docker network and target `http://tog-tandem-tracker:80`, or use the Pi host address. Use your existing access policy if you want the site private. HTTPS should be provided by Cloudflare or your reverse proxy. No Cloudflare account or tunnel configuration is included here, and no existing tunnel files are changed.

If using your own Nginx reverse proxy, proxy this hostname to `http://127.0.0.1:8086`; avoid publishing the Vite development server. The included Nginx is only for this app’s static files.

## Upgrade

Export your progress first, then update the project files and run `docker compose up -d --build` again. Keep the same public hostname to retain browser progress. If the hostname changes, import your backup at the new address. The stored format is versioned; future reading-order edits should keep the IDs in `src/data/tandemReadingOrder.ts` stable.
