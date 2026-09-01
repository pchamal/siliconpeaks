# siliconpeaks
The open repository for [siliconpeaks.com](https://siliconpeaks.com).

Silicon Peaks is a catalog of companies operating in Nepal, or founded by Nepalis, wherever they build.

## Run locally
```bash
npm install
npm run dev -- --persist-to /tmp/siliconpeaks-wrangler-state
```
Serves the site at http://localhost:8787.

The `--persist-to` flag is required: `wrangler.jsonc` serves assets from the repo root (`.`), and wrangler's dev server writes its own state into `.wrangler/state` by default. Since that sits inside the watched assets directory, each state write triggers a reload, which writes state again, looping forever (visible as repeating `Reloading local server...` in the logs) and eventually leaving the server hung. Pointing `--persist-to` outside the repo avoids this.

## Contribute
Fork this repo and open a pull request against `main`. Listings belong if the company operates in Nepal, or has a Nepali founder or cofounder.

Released under the [Apache License 2.0](LICENSE).
