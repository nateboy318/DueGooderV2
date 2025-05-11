---
trigger: model_decision
description: While creating components or pages or fetching data from API
globs: *.tsx
---

- While dealing with client side components, that requires hooks, add "use client" on top.
- While using `useSWR` you don't need to mention fetcher function since it's already set globally in [Providers.tsx](mdc:src/app/Providers.tsx)