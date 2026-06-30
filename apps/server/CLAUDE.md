<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **my-doctor-backend** (symbols, relationships, execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows.
- When you need full context on a symbol, use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()`.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/my-doctor-backend/context` | Codebase overview, index freshness |
| `gitnexus://repo/my-doctor-backend/clusters` | All functional areas |
| `gitnexus://repo/my-doctor-backend/processes` | All execution flows |
| `gitnexus://repo/my-doctor-backend/process/{name}` | Step-by-step execution trace |
<!-- gitnexus:end -->

---

# Backend-Specific Rules

## ESM Import Rule (Critical)
All local imports MUST include `.js` extension even when source file is `.ts`:
```ts
import { sendResponse } from './utils/sendResponse.js'   // correct
import { sendResponse } from './utils/sendResponse'       // breaks at runtime
```

## Module Structure
Every domain module has exactly 4 files:
```
src/modules/{domain}/
├── {Domain}.controller.ts
├── {Domain}.model.ts
├── {Domain}.routes.ts
└── {Domain}.service.ts
```

## Response Utilities
- Success: `sendResponse(res, data, message?, statusCode?, meta?)` from `utils/sendResponse.js`
- Errors: `ErrorUtils.*` from `utils/errorResponse.js`
- **Never** call `res.json()` directly

## Validators
Joi schemas in `src/validators/`. Apply AFTER multer (multer must parse body first):
```ts
router.post("/", verifyAccessToken, upload.single('photo'), validate(schema), Controller.Create)
```

## Auth Middleware Order
```ts
verifyAccessToken → protect(['role'])
```
Always both on protected routes. Never skip `verifyAccessToken`.

## AI Features
LangChain pipelines live in `src/base/`. Never import langchain in frontend or admin.

| File | Purpose |
|------|---------|
| `base/doctor-recommendation.ts` | MongoDB Atlas Vector Search + Gemini |
| `base/symptom-triage.ts` | LangGraph stateful triage agent |
| `base/conversational-ai.ts` | Chat with InMemoryChatMessageHistory |
| `base/web-search.ts` | Brave Search + Gemini summarization |

## Testing
- `NODE_ENV=test` required — omit hits production DB
- Mock Redis, LangChain, Puppeteer in tests
- Always `await mongoose.connection.close()` in `afterAll`
