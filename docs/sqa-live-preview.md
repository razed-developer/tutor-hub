# SQA Live preview

Build the SQA Live source with `npm run build:hub` to target `/apps/live/`. The static frontend can be hosted on Tutor Hub, but its WebSocket relay must be deployed separately and secured before student use. Continue using the existing VPS Jitsi service. Do not add a public catalogue entry until the preview has passed a two-browser test and server-side session authorization is enforced.
