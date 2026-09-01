# Font licensing — ACTION REQUIRED BEFORE PRODUCTION

| File | Family | Weight | Foundry / owner | Status |
|---|---|---|---|---|
| SouthwestSans-Regular.woff2 | Southwest Sans | 400 | Southwest Airlines custom (Monotype) | ⚠️ proprietary — embedding license must be confirmed by the client before go-live |
| SouthwestSans-Bold.woff2 | Southwest Sans | 700 | Southwest Airlines custom (Monotype) | ⚠️ proprietary — same |

Self-hosted for migration fidelity (stardust replica contract). This is the
client's own brand font, so for Southwest itself the license exists; confirm
webfont/self-host terms cover the new delivery domain.

**Remove path:** delete both woff2 files and their `@font-face` rules in
`styles/fonts.css`. All stacks fall back to `southwest-sans-fallback`
(metric-matched Arial: size-adjust 115.09%, ascent 82.37%, descent 29.28%) with
zero layout shift.
