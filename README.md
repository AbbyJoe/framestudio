# FrameStudio: Content Library

A Content Library that lets studio operators find videos, review them, and publish or unpublish them.

## Run it

```bash
npm install
npm run dev      # app + mock GraphQL API at /graphql (no backend needed)
npm test         # Vitest + React Testing Library
npm run build    # type-check and production build
```

### Try the failure scenarios by hand

In `npm run dev`, a **Test scenarios** button sits in the bottom-right corner (dev builds only). It changes the mock backend behind the screen's back:

| Button | What it simulates |
| --- | --- |
| **A · Another operator moves it to Draft** | Open a Ready video, press this, then press Publish. |
| **B · Lose the reply to the next save** | The server saves the change, but the reply never arrives. |
| **Take the server offline** | Every request fails. Use it on the library (load error) or during a publish (status can't be confirmed). |

## Tech stack

React 19, TypeScript, Vite, Apollo Client 4, MSW 3 (mock GraphQL API in the browser and in tests), Tailwind CSS 4, Vitest and React Testing Library.

## How the code is organised

```
src/
├── app/                      App shell, router, Apollo client
├── content/publication.ts    Content type + publication rules (shared by mock server and client)
├── graphql/                  Typed queries and mutation
├── mocks/                    In-memory database + MSW GraphQL handlers
├── components/               Generic UI: Button, Icon
└── features/content-library/
    ├── LibraryScreen.tsx         list UI
    ├── ContentDetailScreen.tsx   one video + publication
    ├── hooks/useContents.ts      list query, search, and status filter
    ├── hooks/usePublication.ts   publish/unpublish and every failure path
    ├── hooks/useDebouncedValue.ts
    ├── components/               presentational pieces (cards, list, panel, notices…)
    └── utils/                    status labels, date/duration formatting
```

Data flow: `useContents` and the detail screen run Apollo queries. `usePublication` runs the mutation. Apollo's normalised cache updates every screen showing that video when the server returns it. Components receive data and callbacks through props, and none of them fetch data themselves. Detail routes use `/contents/:id` (with a redirect from `/content/:id`).

## Handling the engineering scenarios

### Scenario A: Conflicting publication state

The client is never the authority. The Publish button only appears for videos the screen last saw as Ready, but that's a hint. The server re-checks the current status on every `setPublication` (`decidePublicationChange`).

If the video is now Draft, the server rejects with a `CONFLICT` error **that carries the current video**. The client then:

1. writes that video into the Apollo cache, so the screen immediately shows Draft and Publish disappears;
2. shows "Publication status changed" with the Ready → Draft transition, so the operator understands why.

### Scenario B: Uncertain mutation result

The client separates "the server answered no" (a GraphQL error) from "no answer arrived" (a network failure). A network failure is treated as an unknown outcome, not as a failure:

1. The button is disabled while the request is in flight, so there are no double submits.
2. On a lost reply, the screen keeps the **last confirmed** status, so there's no blind revert and no optimistic guess. It then shows "Confirming publication status".
3. It re-reads the video from the server with a one-off query, so a failed check can't wipe the status on screen.
4. If the check succeeds, it shows "Status confirmed: Published" with the real status.
5. If the check also fails, it says the status couldn't be confirmed and labels the badge "Last confirmed · may be out of date". It pauses actions until the status is known and offers **Check again**.

Retrying is safe because `setPublication` is idempotent: publishing an already-published video is a no-op success.

### Scenario C: Delivery trade-offs

I'd pick:

1. **Better loading and error recovery.** This tool changes what paying viewers can see. Wrong feedback ("failed" when it actually published) leads operators to make bad decisions. A smaller tool that tells the truth beats a polished one that misleads.
2. **Automated test coverage of the publication flows.** Publishing is the business-critical path. Tests pin down eligibility, conflicts and lost replies, so tomorrow's quick fixes don't quietly break them.

I'd defer the rest and accept these risks:

- **Optimistic UI.** It conflicts directly with Scenario B, because it shows a state before the server confirms it. Risk accepted: actions feel slightly slower.
- **Enhanced search and filtering.** Title search and a status filter already cover the core need. Risk accepted: power users with large libraries are slowed down.
- **Improved mobile responsiveness.** Baseline responsiveness is in place (one-column layout, the action placed near the top on phones). Risk accepted: less refined mobile interactions.

## Tests

`src/features/content-library/contentLibrary.test.tsx` renders the real app against the MSW mock backend and tests what the operator sees:

| Test | Behaviour |
| --- | --- |
| Shows videos | Library renders what the `contents` query returns |
| Search and filter | Typing and the status tabs re-query the server |
| Library load error | Error state, and Try again recovers |
| Draft can't be published | No Publish button, only a disabled "Not ready" |
| Successful publish | UI and database both end up Published |
| Scenario A | Rejected publish → server status shown with an explanation |
| Scenario B (check succeeds) | Reply lost → confirmed as Published, never "failed" |
| Scenario B (check fails) | Keeps the last confirmed status, pauses actions, Check again recovers |

`src/content/publication.test.ts` and `src/mocks/*.test.ts` cover the publication rules and the mock API on their own.


# Engineering Decisions

### 1. What were the most important engineering decisions you made, and why?

- **The backend remains the source of truth.** The frontend can have stale data, so the server must always validate whether a video can be published.
- **An unknown outcome is different from a failed request.** If the network fails after a mutation, I don't assume it failed. I keep the last confirmed state and fetch the latest status from the server.
- **I avoided optimistic updates.** Publication affects what viewers can access, so I'd rather wait for server confirmation than show a state that may not be correct.
- **I separated publication logic from the UI.** This makes the logic easier to maintain and test, especially when handling conflicts and network failures.
- **Apollo manages server state.** Its normalised cache helps keep content details and list views in sync. I also refetch affected lists when necessary.
- **Publishing and unpublishing happen from the content details page.** This gives operators enough context before making changes.

### 2. Which assumptions did you make because the requirements were incomplete?

- Only videos with `READY` status can be published.
- Unpublishing a video moves it back to `READY`, not `DRAFT`, because the content is still prepared.
- Publishing an already-published video returns its current state without performing another update. This makes retries safe.
- Operators cannot move content from `DRAFT` to `READY` because the provided API doesn't support that operation.
- Search matches video titles and is case-insensitive.
- There is only one operator role. Authentication and permissions are outside the scope of this assessment.
- Search and filter selections don't need to persist after a page refresh.

### 3. What is the most significant weakness or risk in your implementation?

The biggest weakness is that the interface doesn't automatically know when another operator changes a video's status.

This means the information on screen can become stale without the operator knowing. We only discover the conflict when they attempt an action.

### 4. What would you change if the Content Library needed to support 100,000 videos?

I'd make the following changes:

- **Pagination:** Introduce cursor-based pagination instead of loading all videos at once.
- **Search and filtering:** Move these operations fully to the server and use a search index where necessary.
- **Virtualisation:** Render only the video cards currently visible on screen.
- **Image optimisation:** Serve appropriately sized thumbnails through a CDN and lazy-load them.
- **Status counts:** Get status totals from the backend instead of calculating them from the loaded videos.
- **Cache management:** Use targeted cache updates after mutations instead of refetching large lists.

These changes would help the application handle larger datasets without affecting performance.

### 5. What would you improve before making this production-ready?

- Connect to a real backend.
- Introduce authentication, role-based permissions and an audit log for publication activities.
- Add proper idempotency handling for operations with side effects.
- Improve data freshness using polling or GraphQL subscriptions, and refetch when the user returns to the application.
- Add error monitoring and reporting, especially for requests with unknown outcomes.
- Store search and filter selections in the URL so operators can share links and retain their current view after refreshing.

### AI Assistance

I used Claude Code as a pair programmer to help with project scaffolding, UI components, application wiring and drafting automated tests.

I independently reviewed and verified the publication implementation by tracing the publication flow, including success, conflict and network failure scenarios, to understand how each outcome is handled.