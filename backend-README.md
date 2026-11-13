<div align="center">

# Portfolio Backend

### The tiny server that turns "Send message" into an email

Built with Node.js, Express and Nodemailer. Sends through Gmail and deploys on Render.

</div>

---

## The journey of one message

```
 Visitor types a message
          │
          ▼
 Portfolio form  ── POST /contact ──►  This server
                                           │
                       ┌───────────────────┼────────────────────┐
                       ▼                   ▼                    ▼
                 Validate input     Block bots and       Escape the text
                                    repeat senders       (no HTML tricks)
                                           │
                       ┌───────────────────┴────────────────────┐
                       ▼                                        ▼
              Email to my inbox                    Auto-reply to the visitor
```

## The endpoint

`POST /contact`

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `email` | string | required, must look like an email |
| `message` | string | 5 to 3000 characters |
| `website` | string | leave empty (spam trap) |

| Response | Meaning |
|---|---|
| `200 { ok: true }` | Message sent |
| `400` | Something in the input was invalid |
| `429` | Too many requests, try again later |
| `500` | Email could not be sent |

## Safety features

- **Rate limiting:** 5 messages per 15 minutes per visitor.
- **Spam trap:** a hidden field that real people never fill in.
- **CORS lock:** only my portfolio's address can call the server.
- **HTML escaping:** visitors can't inject markup into my inbox.
- **Secrets stay secret:** the Gmail app password lives in environment variables, never in the code.

## Run it locally

```bash
git clone https://github.com/KANISHKAGEETHA/portfolio-backend.git
cd portfolio-backend
npm install
```

Set the environment variables, then start the server.

**Windows PowerShell**
```powershell
$env:GMAIL_USER="you@gmail.com"
$env:GMAIL_APP_PASSWORD="your16charapppassword"
npm start
```

**macOS / Linux**
```bash
export GMAIL_USER=you@gmail.com
export GMAIL_APP_PASSWORD=your16charapppassword
npm start
```

You should see `Server running`.

## Try it

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/contact -ContentType "application/json" -Body '{"name":"Test","email":"test@example.com","message":"Hello from the terminal"}'
```

## Environment variables

| Name | What it is |
|---|---|
| `GMAIL_USER` | The Gmail address that receives messages |
| `GMAIL_APP_PASSWORD` | A Gmail app password (not your normal password) |
| `ALLOWED_ORIGIN` | The URL of the portfolio site, with no trailing slash |
| `PORT` | Set automatically by most hosts, defaults to 3000 |

## Deploy on Render

1. Push this repo to GitHub.
2. On Render, create a **Web Service** from the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the environment variables above and deploy.

The free plan sleeps after a quiet spell, so the first message after a while can take up to a minute.

## Part of my portfolio

The website that talks to this server: **[portfolio](https://github.com/KANISHKAGEETHA/portfolio)**

Built by Kanishka P G, reply2kanishka@gmail.com
