# AlphaVector site

The public site for the AlphaVector framework: home, framework, method, resources and workshops. It is separate from the app (`alphavector-app`) and only links to it.

## Run
```
npm install
cp .env.example .env.local   # then fill in
npm run dev
```

## Environment
- `NEXT_PUBLIC_APP_URL`: where the app is deployed. "Find your fix" links to `${NEXT_PUBLIC_APP_URL}/start`.
- `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM`: workshop enquiries are emailed through Resend. Without them the form says it cannot take enquiries and shows the fallback email.
- `NEXT_PUBLIC_CONTACT_EMAIL`: shown in that fallback.

## Content to keep in step with the app
- Weights and selection ranges on `/method` and `/framework` mirror `lib/career-scoring.ts` and `lib/alphavector/strengths.ts` in the app.
- The source list and reliability scores on `/method` come from the market database notes.
- `lib/processes.ts` repeats the app's process checklists.
- The workshop agenda and audiences are a proposed draft. Edit `app/workshop/page.tsx`.

Fonts (Bricolage Grotesque, Newsreader) are self-hosted through `@fontsource-variable`, so no request goes to Google.
