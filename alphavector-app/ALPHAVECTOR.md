# AlphaVector app

A duplicate of WingSpan (same engine, database schema and Blueprint) with a new front door: instead of reading a resume, the person enters their projects in a table. The marketing site lives in a separate project (`alphavector-site`).

## Routes
- `/` sends signed-in people to `/track`, everyone else to `/start`.
- `/start` is the new flow, four focused screens: (1) You (name optional, where you are now); (2) Projects (an accordion: one open card at a time with labelled fields, skill pills under 'What did you do?', at least three required; 'Add them another way' opens resume, spreadsheet, portfolio link, paste, or examples); (3) Your strengths (cards you can mark 'Not me', plus a separate 'How solid is this?' card); (4) What pulls you (3 to 5 interests, optional niche). Then one calm wait screen and the Blueprint. Import uses WingSpan's reader at `/api/extract`. Guests can run all of it; saving needs sign-in (same rule as WingSpan).
- `/track`, `/paths`, `/profile`, `/experience/[id]` are the existing Design Evolution pages for daily learning and progress. `/track` is the old home page, moved from `/`.
- A Recalibrate button appears on the Blueprint. It keeps the project table (stored in this browser) and restarts the analysis.

## What was added
- `lib/alphavector/` catalogue of processes and niches, skill inference from plain text (`infer.ts`), the suggestion pills that keep offering the next most relevant skill (`suggest.ts`: standard skills first, then suggestive extras), the evidence meter (`progress.ts`), example and paste import (`samples.ts`), the deterministic Proof Score (`strengths.ts`), the mapper into the engine's data shape (`toExtracted.ts`) and tests.
- `components/alphavector/` the flow controller (`StartFlow`), `FlowHeader`, `AboutStep`, `ProjectList`, `SkillPills`, `ImportPanel`, `StrengthsReview`, `PullStep`, `BuildingScreen`, and `ui.ts` (the shared look: bordered labelled boxes are inputs, outlined pills/cards are choices, one filled amber button per screen, plain muted text is read-only).
- `types/wingspan.ts`: optional `hardSkills`, `softSkills`, `feedback`, `remarks`, `energy` on `Project`.

## What was changed from WingSpan
- Name, logo, accent colour and resume wording replaced with AlphaVector and project-log wording.
- The marketing homepage, welcome screen and `/wingspan` page were removed.
- The hard-coded dev session fallback (a fixed user id and email) was removed from `(app)/layout`, `track`, `profile` and `onboarding`. Signed-out visitors are sent to `/login`.
- The resume upload flow (`FootprintScreen`, `ResumeDrop`) is still in the codebase but no longer routed.

## To run
Same environment as WingSpan: `DATABASE_URL`, `JWT_SECRET`, the AI provider keys, `NEXT_PUBLIC_APP_URL`. Use a separate database from the live WingSpan one. `npm test` runs the engine tests plus `lib/alphavector`.

## Known limits
- The engine's role taxonomy, interest list and process checklists are design-focused. Another discipline means editing `lib/alphavector/catalog.ts`, `lib/interests.ts` and `lib/role-taxonomy.ts`.
- The Blueprint pipeline needs the AI keys and database; it was not run end to end in the build sandbox.
