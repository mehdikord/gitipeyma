# GITI (گیتی پیما)

The public site and its admin panel, in one Next.js app backed by MySQL through Prisma.

## Setup

**Prerequisites:** Node.js 20.9 or newer, MySQL 8.

1. Copy `.env.example` to `.env` and fill in the `DB_*` values and a `SESSION_SECRET` (`openssl rand -base64 32`).
2. Install dependencies (this also generates the Prisma client): `npm install`
3. Create the tables: `npm run db:migrate`
4. Fill them: `npm run db:seed`. This creates the admin below and loads the site's starting content (services, offices, testimonials, ...). It is safe to run again: it only adds what is missing and never overwrites edits made in the panel.
5. Start: `npm run dev`

## Admin panel

At `/admins`. Admins sign in with their mobile number and password. The seeded admin:

| Name | Mobile | Password |
| --- | --- | --- |
| Administartor | 09120000000 | 123456 |

Change this password from the profile page right after the first login.

## Database scripts

| Command | What it does |
| --- | --- |
| `npm run db:migrate` | Applies pending migrations (use this on servers) |
| `npm run db:migrate:dev -- --name <name>` | Creates a migration from changes to `prisma/schema.prisma` and applies it |
| `npm run db:seed` | Runs the seeders in `prisma/seeders` |
| `npm run db:fresh` | Drops everything and re-runs all migrations. Development only. |
| `npm run db:studio` | Opens Prisma Studio |

Tables follow Laravel's conventions: snake_case plural names, `BIGINT UNSIGNED` ids and foreign keys (named `<table>_<column>_foreign`), and `created_at` / `updated_at` on every table. Each table has its own `create_<table>_table` migration.

## Structure

```
prisma/
  schema.prisma          the database schema
  migrations/            one folder per migration
  seed.ts, seeders/      DatabaseSeeder and the seeders it runs
src/
  app/(site)/            public pages
  app/admins/            admin panel: login/, upload/, and (panel)/<section>/
  modules/<module>/      everything about one part of the domain:
    schema.ts            zod validation, shared by the form and the server
    queries.ts           reads for the panel (each checks the admin)
    actions.ts           server actions for the panel's changes
  modules/site/          what the public site reads and the forms it submits
  components/admin/      the panel's UI kit: CrudManager, RequestInbox, Modal, fields, DataTable, ...
  lib/                   database client, auth, action helpers, validation, uploads
```

### Adding a section to the panel

1. Add the model to `prisma/schema.prisma` and run `npm run db:migrate:dev -- --name create_<table>_table`.
2. Add `src/modules/<module>/` with `schema.ts`, `queries.ts` and `actions.ts`, following an existing module such as `teamMembers`. Wrap every action in `adminAction`, which checks the admin, validates the input and refreshes the panel.
3. Add `src/app/admins/(panel)/<section>/page.tsx` and a client `<Section>Manager.tsx` that passes columns and form fields to `CrudManager` (list, plus create/edit in a modal).
4. Add the menu entry in `src/components/admin/layout/navigation.ts`.

Site-wide settings (phones, WhatsApp number, company name, ...) are listed in `src/modules/settings/definitions.ts`. A new entry there shows up on the settings page without any other change.

## Run as a Service

The app runs on the Next.js server (`next start`), not as a static export.

1. Build the app and update the database:
   `npm install && npm run db:migrate && npm run build`
2. Install and start the service (edit `User`, `WorkingDirectory` and the node path in [deploy/giti.service](deploy/giti.service) if they differ on your server):
   ```
   sudo cp deploy/giti.service /etc/systemd/system/giti.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now giti
   ```
3. Check it:
   `systemctl status giti` and `journalctl -u giti -f`

The service listens on port 3000; change `PORT` in the unit file to use another port. After deploying new code, run `npm install && npm run db:migrate && npm run build` and `sudo systemctl restart giti`.

Images uploaded in the panel are stored in `storage/uploads/` in the project folder. Keep that folder when redeploying, and include it in backups along with the database.

The admin session cookie is only sent over HTTPS in production. If the site is served over plain HTTP, set `SESSION_SECURE_COOKIE=false` in `.env` or signing in will not stick.
