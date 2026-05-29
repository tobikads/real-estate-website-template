# Real Estate Website Template

A reusable real estate website template built with React, TanStack Start, TypeScript, and Tailwind CSS.

The template is organized so realtor-specific details can be swapped from data files instead of hard-coded across every page:

- `src/data/realtor-profile.ts` controls realtor identity, contact details, license, portrait, and social links.
- `src/data/homepage-content.ts` controls homepage hero images, testimonials, and homepage background images.
- `src/data/listings.ts` controls featured listing content.

## Local Development

```powershell
& "C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .\node_modules\vite\bin\vite.js --host 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:8080/
```

## Build

```powershell
& "C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .\node_modules\vite\bin\vite.js build
```
