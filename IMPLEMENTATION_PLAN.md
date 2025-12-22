# EventMaple – Execution Plan (Supabase + Next.js)

## References (source of truth)
- `app_requirements.md`
- `.windsurf/rules/event_maple_rules.md`

## How to use this plan
- [ ] Work in order, top-to-bottom.
- [ ] Mark items as completed when done.
- [ ] For each branch/deploy, do not merge until **both** commands are green:
  - [ ] `pnpm run build`
  - [ ] `pnpm exec playwright test`

## Delivery structure
- [ ] **Branch/Deploy A: Events v1**
  - [ ] DB migration(s): event timezones + UTC timestamps + categories + status
  - [ ] App: Create/Edit + My Events view + Publish/Draft lifecycle + SSR + i18n + tests
- [ ] **Branch/Deploy B: Talks & Batch Import**
  - [ ] App: Talks management (CRUD) + tags + speaker details + is_fixed
  - [ ] App: Batch Import (CSV/Excel/PDF/URL) -> Preview/Edit -> Commit
  - [ ] Tests: Import flows + Talk management
- [ ] **Branch/Deploy C: User Profile v1**
  - [ ] DB migration(s): `user_profiles` + triggers + RLS
  - [ ] App: profile settings + SSR + i18n + tests

> Important: `auth.users` is not modified. All user data lives in `public.user_profiles` and references `auth.users(id)`.

---

## Current State (DB)
Authoritative DB schema currently includes:
- `public.events` (bigint id, `start_date`/`end_date` as `date`)
- `public.talks` (date + `start_time`/`end_time` as `time without time zone`)
- `public.users_events`, `public.personal_agenda`

RLS exists for the main tables.

---

# Pre-Phase (applies to both Branch A and Branch B)

## P0) Project hygiene / baseline
- [x] Create/confirm a clean git state on the target branch.
- [x] Ensure PNPM is the package manager used for all installs and scripts.
- [x] Run baseline verification on the current main branch (before changes):
  - [x] `pnpm run build`
  - [x] `pnpm exec playwright test`

## P1) i18n baseline checks
- [x] Confirm the routing structure is under `/app/[locale]/...`.
- [x] Confirm locales exist: `en`, `es`, `pt`, `fr`.
- [x] Confirm there is a missing-key validation step (or add it in tests).

## P2) PWA/SEO baseline checks
- [x] Confirm PWA manifest/service worker still works after each change.
- [x] Confirm SSR is preserved for public pages.
- [x] Confirm pages use `generateMetadata` and include canonical + hreflang where applicable.

---

# Phase 1 (global): Replace ESLint with Biome

## B0) Tooling migration
- [x] Add Biome to the project and configure it for TypeScript + React.
- [x] Replace `lint`/format scripts to use Biome.
- [x] Remove ESLint dependencies/configuration once Biome is active.
- [x] Ensure IDE/editor integration is updated (optional but recommended).

## B1) Verification
- [x] `pnpm run build`
- [x] `pnpm exec playwright test`

---

## Target Data Model (MVP)

### Events: UTC timestamps + IANA timezone
Per `app_requirements.md`, each event must store:
- `start_at` in UTC (`timestamptz`)
- `end_at` in UTC (`timestamptz`)
- `timezone` as an IANA string (e.g. `America/Bogota`)

Additional requested field:
- `country_code` as ISO 3166-1 alpha-2 (e.g. `CO`, `US`)
- `status` (draft/published)

Recommended event fields (incremental; keep legacy columns for compatibility):
- `start_at timestamptz null` (temporarily nullable for safe rollout)
- `end_at timestamptz null` (temporarily nullable for safe rollout)
- `timezone text not null default 'UTC'`
- `country_code text null`
- `status text not null default 'draft' check (status in ('draft', 'published'))`

### Categories: Single Category per Event
- **Constraint:** exactly **one category** per event.
- Categories are **admin-managed**.

Tables:
- `event_categories`
  - `id uuid pk default gen_random_uuid()`
  - `slug text unique not null` (e.g. `technology-software`)
  - `is_system boolean not null default true`
  - `is_active boolean not null default true`
  - `sort_order int not null default 0`
  - `created_at timestamptz not null default now()`

- `event_category_translations` (future-ready; used when `is_system = true`)
  - `id uuid pk default gen_random_uuid()`
  - `category_id uuid not null fk -> event_categories(id) on delete cascade`
  - `locale text not null` (`en|es|pt|fr`)
  - `name text not null`
  - `description text null`
  - `unique(category_id, locale)`

Events table change:
- `events.category_id uuid null fk -> event_categories(id)`

Initial category list (seeded):
1. `technology-software`
2. `business-startups`
3. `education-learning`
4. `design-creative`
5. `community-networking`
6. `arts-culture`
7. `music-entertainment`
8. `health-wellness`
9. `sports-recreation`
10. `social-causes`
11. `food-drink`
12. `other`

### User Profile
Table:
- `user_profiles`
  - `id uuid pk fk -> auth.users(id) on delete cascade`
  - `email text null` (optional but convenient)
  - `display_name text null`
  - `avatar_url text null`
  - `locale text not null default 'en'` with check in (`en`,`es`,`pt`,`fr`)
  - `timezone text not null default 'UTC'`
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`

Automation:
- Trigger to create `user_profiles` row automatically.
  - Preferred: create on email confirmation (not always feasible purely in DB).
  - Practical: create on `auth.users` insert (signup) and keep it idempotent.

---

# Branch/Deploy A – Events v1

## A1) Supabase migration(s) (incremental)
- [ ] Create a new migration that:
  - [ ] Adds to `public.events`:
    - [ ] `start_at timestamptz` (nullable for rollout)
    - [ ] `end_at timestamptz` (nullable for rollout)
    - [ ] `timezone text not null default 'UTC'`
    - [ ] `country_code text null`
    - [ ] `status text not null default 'draft' check (status in ('draft', 'published'))`
    - [ ] `category_id uuid` (FK)
  - [ ] Creates `event_categories` (+ constraints + indexes)
  - [ ] Creates `event_category_translations` (+ constraints + indexes)
  - [ ] Seeds the 12 core categories (admin-managed) with stable slugs and `sort_order`.

- [ ] RLS / Policies
  - [ ] `event_categories`:
    - [ ] `SELECT` public
    - [ ] Writes restricted (service role only, until an admin system exists)
  - [ ] `event_category_translations`:
    - [ ] `SELECT` public
    - [ ] Writes restricted (service role only)
  - [ ] `events`:
    - [ ] Keep existing policies; ensure they allow updating the new columns for owners.

- [ ] Data backfill (safe for existing data)
  - [ ] `events.timezone = 'UTC'` where null
  - [ ] `events.status = 'published'` (assume existing events are public)
  - [ ] `events.category_id = (select id from event_categories where slug = 'other')` where null
  - [ ] Leave `start_at/end_at` null for existing rows initially (avoid incorrect assumptions)
  - [ ] Optional backfill strategy (only if you want it now):
    - [ ] Derive `start_at/end_at` from min/max talks per event using `events.timezone`

## A2) App changes (Next.js)

### A2.1) Data access and validation (server-side)
- [ ] Update TypeScript DB types for `events`.
- [ ] Update queries to include:
  - [ ] `start_at`, `end_at`, `timezone`, `country_code`, `category_id`, `status`
- [ ] Add query to list categories for the creation form.
- [ ] Validate/normalize inputs server-side:
  - [ ] `timezone` must be a valid IANA timezone (validation strategy documented)
  - [ ] `country_code` must be length=2 if provided

### A2.2) UI – Create/Edit Event (SSR-first)
- [ ] Add pages/sections to create and edit events (owner-only writes).
- [ ] **My Events View**: List of events created by the current user with status indicators.
- [ ] Form fields (MVP):
  - [ ] name/title
  - [ ] description
  - [ ] start date + start time (in event timezone)
  - [ ] end date + end time (in event timezone)
  - [ ] timezone (IANA select)
  - [ ] country_code (select)
  - [ ] category (single select)
  - [ ] location / organizer / image_url (if supported in the current schema)
- [ ] **Lifecycle Controls**:
  - [ ] Save as Draft
  - [ ] Publish (sets `status='published'`)
  - [ ] Unpublish (sets `status='draft'`)

- [ ] Conversion rule (must work in SSR)
  - [ ] UI collects local date/time + timezone
  - [ ] Server converts to UTC and stores `start_at/end_at` (`timestamptz`)
  - [ ] Store original `timezone`

### A2.3) i18n keys (all locales)
- [ ] Add keys for event create/edit pages:
  - [ ] Page titles
  - [ ] Field labels/placeholders
  - [ ] Validation messages
  - [ ] Status labels (Draft/Published)
- [ ] Add category names in `messages/{locale}.json` (12 categories, 4 locales)
- [ ] Ensure **no visible text** is hardcoded

### A2.4) SEO
- [ ] Add `generateMetadata` for new pages
- [ ] Canonical + hreflang for all locales

## A3) Playwright tests (Events v1)
- [ ] Add/extend tests:
  - [ ] SSR rendering for event create/edit pages (all 4 locales)
  - [ ] i18n validation (missing keys fail)
  - [ ] Routing/navigation
  - [ ] SEO metadata assertions (where applicable)
  - [ ] Create event happy path:
    - [ ] Create event with `start_at/end_at` + timezone + category
    - [ ] Save as Draft -> Verify in My Events list
    - [ ] Publish -> Verify visible publically
    - [ ] Verify it appears in event list and detail pages
  - [ ] Timezone sanity check:
    - [ ] Ensure displayed time matches event timezone expectations (SSR)

## A4) Verification commands (mandatory)
- [ ] `pnpm run build`
- [ ] `pnpm exec playwright test`
- [ ] If failing: fix and re-run both commands until green

---

# Branch/Deploy B – Talks & Batch Import

## B1) Supabase migration(s)
- [ ] Verify `public.talks` schema matches requirements:
  - [ ] `title` (text)
  - [ ] `short_description` (text)
  - [ ] `detailed_description` (text)
  - [ ] `start_time`, `end_time` (timestamp/time logic to be confirmed with Event timezone)
  - [ ] `speaker_name`, `speaker_bio`, `speaker_photo`
  - [ ] `tags` (text array)
  - [ ] `is_fixed` (boolean)
- [ ] Add any missing columns if needed.

## B2) App Changes (Talks Management)
- [ ] **Talks List (per Event)**:
  - [ ] View list of talks within the Event Edit dashboard.
  - [ ] Add/Edit/Delete individual talks.
- [ ] **Talk Form**:
  - [ ] Fields: Title, Short Desc, Long Desc, Start/End, Speaker (Name/Bio/Photo), Tags (array input), Is Fixed (checkbox).
  - [ ] i18n: All labels and validations.

## B3) App Changes (Batch Import)
- [ ] **Import UI**:
  - [ ] Section to import talks in "My Events" -> "Manage Talks".
  - [ ] Input methods:
    - [ ] File upload (CSV, Excel, PDF).
    - [ ] URL input (scrape/extract).
- [ ] **Processing Logic**:
  - [ ] Parser service (server-side) to extract structural data from files/URL.
  - [ ] Mapping logic to `talk` fields.
- [ ] **Preview & Correction**:
  - [ ] Display extracted data in an editable table/grid *before* saving to DB.
  - [ ] Allow user to correct fields (Time, Title, Speaker) in the UI.
  - [ ] "Confirm Import" button to commit to `public.talks`.
- [ ] **i18n**: Keys for import instructions, errors, column headers.

## B4) Playwright tests (Talks & Import)
- [ ] Test Manual CRUD: Create/Edit/Delete a talk.
- [ ] Test Import Flow:
  - [ ] Mock file upload/URL response.
  - [ ] Verify Preview appears.
  - [ ] Edit a preview item.
  - [ ] Confirm import and verify DB records.

## B5) Verification
- [ ] `pnpm run build`
- [ ] `pnpm exec playwright test`

---

# Branch/Deploy C – User Profile v1

## C1) Supabase migration(s) (incremental)
- [ ] Create a new migration that:
  - [ ] Creates `public.user_profiles`:
    - [ ] `id uuid primary key references auth.users(id) on delete cascade`
    - [ ] `email`, `display_name`, `avatar_url`
    - [ ] `locale` with allowed values (`en`,`es`,`pt`,`fr`)
    - [ ] `timezone` (IANA)
    - [ ] `created_at`, `updated_at`
  - [ ] Adds triggers:
    - [ ] `handle_new_user_profile` on `auth.users` insert
      - [ ] idempotent insert (safe if called multiple times)
    - [ ] `set_updated_at` on `user_profiles`
  - [ ] Adds RLS:
    - [ ] `SELECT` where `auth.uid() = id`
    - [ ] `UPDATE` where `auth.uid() = id`
    - [ ] `INSERT` blocked from client (optional; trigger handles creation)

## C2) App changes (Next.js)

### C2.1) Profile access
- [ ] Add server-side helper to fetch current user profile
- [ ] Ensure SSR where possible

### C2.2) UI – Profile settings
- [ ] Add profile settings page:
  - [ ] display name
  - [ ] avatar URL
  - [ ] preferred locale
  - [ ] preferred timezone
- [ ] Default values:
  - [ ] locale defaults to `en`
  - [ ] timezone defaults to `UTC`

### C2.3) i18n keys (all locales)
- [ ] Add keys for:
  - [ ] Profile page title
  - [ ] Labels for display name, avatar URL, locale, timezone
  - [ ] Save / success / error messages

### C2.4) SEO
- [ ] `generateMetadata` for the profile settings page

## C3) Playwright tests (Profile v1)
- [ ] Ensure profile page SSR loads for all locales
- [ ] Update profile flow:
  - [ ] Change timezone and locale
  - [ ] Refresh and verify persisted values
- [ ] i18n key completeness checks
- [ ] SEO assertions (where applicable)

## C4) Verification commands (mandatory)
- [ ] `pnpm run build`
- [ ] `pnpm exec playwright test`
- [ ] If failing: fix and re-run both commands until green

---

# Post-MVP / Optional (requires explicit scope decision)

## Tags
`app_requirements.md` lists tags as a future consideration (not MVP).

- [ ] If tags are promoted into MVP, update `app_requirements.md` accordingly.
- [ ] Add `events.tags text[] not null default '{}'`.
- [ ] Add UI support for tag input.
- [ ] Add tests covering tag persistence and filtering (if implemented).

---

## Open questions / final confirmations
- [ ] Should `events.category_id` be `NOT NULL` immediately, or only after backfill?
- [ ] Should `events.start_at/end_at` be enforced `NOT NULL` after the edit flow exists?
- [ ] Add DB CHECK constraints:
  - [ ] `country_code` length=2 (if provided)
  - [ ] `locale` in (`en`,`es`,`pt`,`fr`)
