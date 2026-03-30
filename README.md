# proxima.cafe — Memberstack Gated Content

Webflow + Memberstack integration for proxima.cafe. Gates long-form content behind a membership plan using a pure DOM/attribute approach — no `$memberstackDom` JS API required.

## How it works

The gate script runs inline (before Memberstack's deferred script) and:

1. Clips `[data-ms-gated="true"]` elements to 160px with a fade overlay
2. Injects a gate panel with `data-ms-content="!pln_member-5l7v0yls"` — Memberstack natively hides this for members with the plan
3. Polls every 200ms: when the panel is hidden, the clip is removed and the full content is revealed
4. Hides `.item-subtitle` (preview excerpt) for members via `data-ms-content`

## Project structure

```
webflow/
  gated-content.js     # Paste into Webflow Footer Code (inside <script> tags)

server/
  index.js             # Express server entry point
  middleware/auth.js   # Verifies Memberstack JWT via Admin API
  routes/api.js        # /api/member, /api/members, /api/plans, /api/gated-content
  routes/webhooks.js   # Memberstack webhook handlers

test/
  gate-test.html       # Local test file — open in browser to preview gate UI
```

## Setup

### Webflow

1. Add `data-ms-gated="true"` to any CMS element you want to gate
2. Paste the contents of `webflow/gated-content.js` into **Site Settings → Custom Code → Footer Code** (wrap in `<script>` tags)
3. Publish the site

### Server

```bash
cp .env.example .env
# Fill in your keys in .env
npm install
npm start
```

### Environment variables

| Variable | Description |
|---|---|
| `MEMBERSTACK_SECRET_KEY` | Memberstack secret key (Admin API) |
| `MEMBERSTACK_APP_ID` | Memberstack app ID |
| `MEMBERSTACK_PLAN_ID` | Plan ID to gate content behind |

## Testing

**Local HTML preview**

Open `test/gate-test.html` in a browser to preview the gate UI and toggle between states.

**Live site test panel**

Append `?test=true` to any gated page URL to activate a floating test panel with three modes:

- **Guest** — shows the gate (default state)
- **Member (with plan)** — simulates a member who has access
- **Member (no plan)** — simulates a logged-in member without the required plan

## Key IDs

| | |
|---|---|
| Plan ID | `pln_member-5l7v0yls` |
| App ID | `app_cmklqoq5203n60su9hwxwbtiv` |
| Site ID | `689ef94f9e90e87709db8429` |
