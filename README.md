<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1I3mUxKCpbkWdf43CsU0w8rqC-XL8YaQ-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set up Supabase (see below), then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`
3. Run the app:
   `npm run dev`

## This project vs. FNDS

This repo is the **public landing page only**. The FNDS business-management app (leads, customers,
payments, expenses, plans, dashboard) is a **separate project** — see `../fnds-admin` — with its
own codebase, its own build, and its own deployment. They are not bundled together, so visitors to
this site never download any admin code.

The only thing the two share is a Supabase backend: this site's "Apply for Service" form writes
directly into the `leads` table, and FNDS reads from that same table. Set up Supabase once and
point both projects at it:

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a free project, then open
**Project Settings → API** and copy the **Project URL** and **anon public key** into this
project's `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxx
```

(Use the same two values in `fnds-admin/.env.local`.)

### 2. Create the database tables

In Supabase, open **SQL Editor → New query**, paste the contents of
[`../supabase/schema.sql`](../supabase/schema.sql), and run it. This creates the `leads`,
`customers`, `payments`, `expenses`, and `plans` tables and sets up row-level security: this
landing page's anon key can only **create** leads (it can't read customer/payment data), while
signed-in FNDS staff can read/write everything.

### 3. Deploying

Deploy this project as you would any Vite app (Vercel, Netlify, etc.), at your main domain, with
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set as environment variables. Deploy `fnds-admin`
separately — see its own README for details, including why hosting it on a different
subdomain is a good idea.
