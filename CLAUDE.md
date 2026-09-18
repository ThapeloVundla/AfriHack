# Afrihack project instructions

This is a 24-hour hackathon build by a team of four. We ship a working MVP, not a finished product. Read @PROBLEM.md at the start of every session. It holds the problem statement, the core flow and the list of things we are not building.

## Stack

- Plain HTML, CSS and vanilla JavaScript only. No React, Vue, Svelte, TypeScript, Sass, bundlers, npm packages or build steps.
- The site must run by opening index.html or through VS Code Live Server. No backend unless PROBLEM.md requires one. Ask first.
- CDN scripts (for example a chart or map library) need approval. Try plain JS first.
- Default layout: index.html, styles.css, script.js and an assets folder. Add files only when a task needs them.
- Use semantic HTML, CSS custom properties for colours and spacing, const and let, and no inline styles.
- Save data in localStorage or in a hardcoded sample data file. No login unless the problem statement demands one.

## Mobile first

- Design for a 360px wide screen first, then scale up with min-width media queries.
- No horizontal scrolling at 360, 768 or 1280px.
- Tap targets are at least 44px. Body text is at least 16px.
- Include the viewport meta tag, alt text on images, visible focus states and readable colour contrast.

## MVP rules

- Build the one core user flow from PROBLEM.md end to end before anything else.
- Anything outside the core flow goes on the Later list in PROBLEM.md, not into the code.
- The app stays runnable at all times. A working demo beats a complete feature.
- Sample data is fine. Real-sounding placeholder copy replaces lorem ipsum.

## Check in before big decisions

Ask before deciding page layout, site structure, features, dependencies or new file types. Offer two or three concrete options with your recommendation, and keep the question short. Do not ask about small choices such as naming, spacing, copy tweaks or colours inside an agreed palette. Make those yourself.

## Working in a team of four

- Change only the files the task needs. Do not reformat, rename or reorganise code you were not asked to touch.
- Do not commit or push unless asked. Never force push and never rewrite history.
- Keep commits small, one change each.

## Writing rules

These apply to everything you write: site copy, code comments, commit messages and docs.

- Use British spelling.
- Use sentence case for headings, buttons and labels.
- Write full sentences in the present tense and the active voice. Vary sentence length.
- Start with the content. No preamble, and do not repeat a heading in the sentence under it.
- Use no em dashes, no emojis and no curly quotes. Use hyphens sparingly.
- Use bold rarely. Use no bullet lists in page copy. Real interface lists such as navigation menus are fine.
- Write the way a small business owner talks to a customer: concrete, plain words, specific details.
- Skip aphorisms, quotable one-liners, "at its core", fake candour ("honestly", "to be frank") and strawmen ("most sites do X, we do Y").
- Skip filler and marketing words such as seamless, elevate, unlock, empower, journey and leverage.
- Code comments explain why, not what. One plain sentence is usually enough.
- Commit messages have a short subject in the imperative present ("Add booking form"), under 60 characters, with no prefix and no trailing full stop.
