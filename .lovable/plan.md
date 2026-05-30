# Vaelora — Backend, Auth & Flag-Gated CTF Labs

Turn the localStorage prototype into a real platform with accounts, a database, persistent progress, public profiles, private rank, and **flag-gated interactive labs** — students must capture a flag in the simulated terminal before advancing.

## Decisions locked in
- **Auth:** Email/password + Google (with email verification + password reset)
- **Labs:** Simulated in-browser terminal, **flag-gated** — no flag, no next lesson
- **Leaderboard:** Private rank only (no public board)
- **Profiles:** Public profiles (username, avatar, badges)

---

## The Lab / Flag Mechanic (the core experience)

Each module becomes a **mission**:
1. Short story sets the scene (*"A server was breached at 2AM…"*).
2. Student works in the **simulated terminal**, typing real commands.
3. Realistic scripted output guides them; wrong commands give errors + `hint`.
4. Hidden somewhere in the scenario is a **flag**: `VAELORA{...}`.
5. Student submits the flag in a flag box.
6. **Server verifies the flag** → awards XP, marks module complete, unlocks the next lesson.
7. The **Next Lesson / Mark Complete button stays locked** until the correct flag is accepted.

Flags are validated **server-side** (the answer is never shipped to the browser) so students can't cheat by reading the source. Each lab supports `help`, `hint` (costs nothing or small XP), and `clear`.

`curriculum.ts` `Lab` type gets extended with: scenario text, terminal command/response script, and a `flagId` (the actual flag value lives server-side, keyed by `flagId`).

---

## Build Phases

### Phase A — Enable Lovable Cloud + Auth
- Enable Cloud (database, auth, server functions).
- Email/password + Google sign-in; email verification + password reset.
- Routes: `/login`, `/signup`, `/reset-password`.
- `_authenticated` layout guard; gate `/dashboard` + progress. Curriculum browsing stays public.
- Root `onAuthStateChange` for cache invalidation; Navbar user menu (avatar + logout).

### Phase B — Database schema (RLS + grants on every table)
- `profiles` — id, username (unique), display_name, avatar_url, bio. Auto-created via signup trigger. Public read, owner update.
- `user_progress` — user_id, module_id, completed_at. Owner-only.
- `lab_progress` — user_id, module_id, completed_steps, flag_captured, updated_at. Owner-only.
- `user_stats` — user_id, xp, current_streak, longest_streak, last_active. Owner read; written only by server logic.
- `quiz_results` — user_id, phase_id, score, total, taken_at. Owner-only.
- `user_achievements` + static `achievements` list. Earned rows public-readable for profiles.
- `lab_flags` — module_id, flag_value. **Server-only** (no client read) — used to verify submissions.
- `user_roles` (+ `app_role` enum + `has_role()` security-definer fn) for future admin tooling.

Rank computed on demand (count of users with higher XP), not stored.

### Phase C — Server logic (createServerFn)
- `submitFlag(moduleId, flag)` — compares against `lab_flags` server-side; on match: marks module complete, awards XP, updates streak, checks achievements, unlocks next lesson. Idempotent (no double XP).
- `saveLabProgress` — persists terminal step progress mid-lab.
- `saveQuizResult` — stores score + bonus XP.
- `getDashboard` — stats, resume target, recent activity, **private rank** ("You're #142 of 3,500").
- `getProfile(username)` — public profile data (badges, XP, phases cleared, join date).
- `migrateLocalProgress` — one-time import of existing localStorage progress on first login.

### Phase D — Simulated terminal + flag UI
- Replace checkbox `LabPanel` with a real terminal component (prompt, history, typed input, scripted responses).
- Flag submission box below the terminal; locked Next button until `submitFlag` succeeds.
- Success animation + XP toast on capture; clear "flag accepted / try again" feedback.
- Keep the existing cyberpunk terminal aesthetic.

### Phase E — Profiles + rewire UI
- `/u/$username` public profile page (badges, XP, phases cleared).
- Rewrite `useProgress` to read/write via server functions + TanStack Query (no more localStorage as source of truth).
- Dashboard shows real XP, streak, completion, private rank, badges.
- Account settings: edit display name, avatar, bio.

---

## Recommended extras (included above)
- **Email verification + password reset** (real auth hygiene)
- **Badges** to give public profiles substance (*First Blood*, *Phase Cleared*, *Night Owl*)
- **Quiz result storage** (currently lost)
- **Server-side XP/flag verification** (anti-cheat)
- **Progress migration** so early users keep their work

## Technical notes
- All DB access via TanStack Start server functions (no Supabase Edge Functions). RLS as backstop, server functions as the primary gate.
- Flag answers + XP mutations live **only** server-side.
- Terminal scripts are data-driven from `curriculum.ts`; the engine is generic.

## Out of scope (for now)
- Real cloud sandboxes / live VMs (cost-prohibitive for a free platform — upgrade path preserved).
- Admin curriculum editor (roles table added so it's easy to add later).

Proceed with all phases, or start with A + B (auth + database) and then layer in the flag labs?