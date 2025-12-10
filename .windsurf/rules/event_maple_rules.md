---
trigger: always_on
---


# Event Maple – Project Rules (Refined, Extended & Execution-Aware)

## <core_tech_stack>
- **Package manager**: PNPM (mandatory).
- **Framework**: Next.js 16 (App Router).
- **Frontend**: React 19.
- **TypeScript**: Required everywhere.
- **PWA**: Full PWA built with Next.js (including SSR).
- **Infrastructure**: Supabase (DB + Auth).
</core_tech_stack>

## <llm_execution_rules> LLM Code-Execution Rules (CRITICAL)

Whenever the LLM is instructed to make **any code modifications, generate new code, create new routes, components, pages, configurations, or tests**, it MUST follow these rules:

### 1. **Mandatory Plan Creation**
Before writing any code, the LLM must:
- Generate a clear step-by-step execution plan.
- The plan must include:
  - i18n key extraction and updates  
  - SEO metadata implementation (if applicable)  
  - Test creation (Playwright)  
  - Ensuring SSR when needed  
  - PWA compatibility checks  
  - Running `pnpm run build`  
  - Running Playwright tests  
  - Verifying that the build and tests pass  
- The LLM cannot finish the task **until the plan is completed**.

### 2. **Mandatory Build & Test Execution**
After generating or modifying code, the LLM must:
- Execute:

```
pnpm run build
```

- And execute:

```
pnpm exec playwright test
```

These steps ensure that:
- The generated code compiles correctly.
- No SSR/i18n/SEO/PWA behavior broke.
- All Playwright tests pass.
- No missing i18n keys exist.

### 3. **Failure Handling**
If build or tests fail:
- The LLM must:
  - Inspect the error
  - Fix the issue
  - Re-run `pnpm run build`
  - Re-run Playwright tests
- It must repeat this loop until **all errors are resolved**.

### 4. **Forbidden Behavior**
- The LLM must NOT generate incomplete code.
- The LLM must NOT skip build or tests.
- The LLM must NOT end the task until:
  - Build succeeds  
  - Tests succeed  
  - i18n keys exist in all languages  
  - SEO metadata is properly set (if applicable)  
  - PWA compatibility is preserved  

</llm_execution_rules>

## <i18n_strategy> Internationalization (next-intl)

### Library
- Only `next-intl` allowed.

### Structure
- All routes inside `/app/[locale]/...`.
- Locales: en (default), es, pt, fr.

### Middleware
- Locale detection & redirection.

### Rules
- No visible text hardcoded.
- Extract all strings to `messages/{locale}.json`.
- Server Components → `getTranslations`
- Client Components → `useTranslations`
- All keys must exist in all 4 languages.

</i18n_strategy>

## <translation_management> Translation JSON Rules

### Location
`/messages/{locale}.json`

### Rules
- Keys grouped by feature/page.
- No duplicates.
- All locales must be updated simultaneously.

</translation_management>

## <seo_guidelines> SEO & Metadata (SSR Required)

- Pages must use `generateMetadata`.
- Add canonical + hreflang for all locales.
- Root `/` must 307 redirect to detected locale.
- Sitemap must generate localized routes.
- Prefer SSR for SEO/security.

</seo_guidelines>

## <security_standards>

- Prefer server-side logic.
- No sensitive logic on the client.
- Validate & sanitize all input.
- Add security headers.
- Avoid unnecessary dependencies.

</security_standards>

## <development_standards>

### Navigation
- Use `Link` and `redirect` from `@/i18n/navigation`.

### Components
- Prefer Server Components.
- Client Components require `"use client"`.

### Database
- Keep current structure; future multi-language columns planned.

</development_standards>

## <pwa_requirements>

- Ensure PWA compatibility at all times.
- Maintain manifest & service worker.
- Update caching when relevant.

</pwa_requirements>

## <testing_standards>

### Required Tests (Playwright)
1. SSR/CSR rendering  
2. i18n validation for all 4 locales  
3. Missing key validation  
4. Routing & navigation  
5. SEO tests  
6. Accessibility (recommended)

### Rule
**No feature can be merged without tests.**

</testing_standards>

## <generation_rules> AI / Code Generation

Whenever the AI generates new code:

### 1. Create i18n keys for all languages.
### 2. Create/update Playwright tests.
### 3. Add metadata for SEO.
### 4. Prefer SSR.
### 5. Ensure PWA compatibility.

All changes must pass:
- `pnpm run build`
- `pnpm exec playwright test`

</generation_rules>
