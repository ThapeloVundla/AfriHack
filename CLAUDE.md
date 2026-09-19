# Afrihack project instructions

This is a 24-hour hackathon build by a team of four. The product is called Fin Flow, written as two words with a capital on each. Use that name in the page title, header, footer and any copy that names the product. We ship a working MVP, not a finished product. Read @PROBLEM.md at the start of every session. It holds the problem statement, the core flow and the list of things we are not building.

## Stack

- Plain HTML, CSS and vanilla JavaScript only. No React, Vue, Svelte, TypeScript, Sass, bundlers, npm packages or build steps.
- Run the site through VS Code Live Server started from the repo root, or from GitHub Pages. No backend unless PROBLEM.md requires one. Ask first.
- CDN scripts (for example a chart or map library) need approval. Try plain JS first.
- The site is four pages in the repo root, each with its own stylesheet and script: index.html (landing page with a hero and a login button), portal.html (sign in and create account screen), dashboard-client.html and dashboard-broker.html. Files are named after their page, for example portal.css and portal.js. The assets folder holds logo.jpg and other images.
- base.css holds the colour variables and common styles, and data.js holds all sample data and helper functions. Every page loads them. Never copy their contents into a page.
- The portal has a section called MVP demo direct pipeline (no auth needed) with two buttons that log you in as a demo broker or a demo client. The sign in and create account form is visual only. The buttons save the session under finflow:session and redirect to the matching dashboard. Each dashboard checks the session on load and sends anyone without the right role back to portal.html.
- Each dashboard shows its screens as sections of one page that JavaScript switches between. Ask before adding another HTML page.
- Prefix every localStorage key with finflow:.
- Use semantic HTML, CSS custom properties for colours and spacing, const and let, and no inline styles.
- Save data in localStorage, seeded from data.js. There is no real authentication.

## Colours

Define these four as CSS custom properties in :root of base.css and never hard-code hex values anywhere else.

- --crimson: #C02D2E for calls to action only, meaning primary buttons, link hover and the active menu item. Use it sparingly.
- --black: #231F20 for main headings, the footer background and important section separators.
- --offwhite: #FAFAFA for the main page background.
- --charcoal: #333333 for paragraph text and other body content.

Put light text on the black footer, and never crimson text, because the contrast is too low. Tints of these four are fine for borders and cards. Ask before adding any other hue.

## Mobile first

- Build index, portal and the client dashboard for a 360px wide phone first, then scale up with min-width media queries.
- Build the broker dashboard for a 1280px desktop first, since brokers work at a desk. It must still work at 360px.
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
- Pull before starting each task, because two people work in each dashboard.

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
