# Ask4Date

A playful React app that lets someone pick the kind of date they want, share a free day, and send the details to `wailbouymaj@gmail.com`.

## What it collects

- Their name
- Their choice of `Coffee date`, `Dinner`, `Some activity`, or `Something else`
- Extra details when they choose `Some activity` or `Something else`
- A date they are free

## Email delivery

The frontend submits the form to `api/send-date-request.js`, which sends the email using [Resend](https://resend.com/).

The email goes to:

- `wailbouymaj@gmail.com`

## Environment variables

Copy `.env.example` and provide real values for:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Example sender:

```env
RESEND_FROM_EMAIL=Ask4Date <onboarding@resend.dev>
```

For production, replace the onboarding address with a sender or domain verified in Resend.

## Run locally

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm start
```

## Deployment note

The email route was added as `api/send-date-request.js`, which is meant for platforms that support root-level serverless functions such as Vercel. Set the two Resend environment variables in your hosting provider before testing the form submission in production.

## Build

Create a production build with:

```bash
npm run build
```
