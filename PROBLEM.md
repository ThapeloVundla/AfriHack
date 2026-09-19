# Problem statement

The full brief is in the repo as brief.pdf. This file is the short version every teammate's AI reads at the start of each session.

## The problem

Royal Square Financial is an independent brokerage in Johannesburg. It sells insurance and investment products from many providers, including Sanlam, Old Mutual, Liberty, Momentum, Discovery, Allan Gray and Santam. Regulation means every client interaction creates compliance admin, so advisers spend more time on forms than with the people they advise. The firm wants software that makes communication between the firm and its clients faster and less manual.

The brief asks for three core pieces:

- A client dashboard showing each client's financial position and net worth in one place.
- Automated reminders for tasks, documents, renewals and reviews, sent to the broker, the client or both. The list of reminders keeps growing.
- Goal tracking for individual or shared goals, with a visual view of progress.

The brief also describes one task in full: a client reports an accident, registers a motor claim with their insurer, and the app tracks the claim through ten steps until the client reviews it and closes it. Other tasks it lists are change of address, change of bank details, policy document requests, consultation requests, border letters and IRP5 requests. Its guiding principle is that the more information passes straight through to product providers automatically, the more useful the app becomes.

## Who it is for

Two roles on one website. Clients, mostly on a phone, and brokers, mostly on a desktop. Both enter through the same landing page and portal, then land on their own dashboard.

## Judging criteria

Not known yet. Paste them here when the organisers release them.

## Core flow (the MVP)

A judge opens Fin Flow, clicks login and enters the portal. As a client, they see their net worth and goals, report an accident and register a motor claim. As a broker, they see the claim, move it through its steps and see the reminders it triggers.

## Decisions made

- The product is called Fin Flow. The logo is assets/logo.jpg.
- This is a demo concept with mock data, not a finished product. No real backend, real logins, real emails or real provider integrations.
- One website with four pages. index.html is the landing page with a hero and a login button. portal.html is the sign in and create account screen. dashboard-client.html and dashboard-broker.html are the two dashboards. Each page has its own css file, such as portal.css and dashboard-client.css.
- In a real product a work email would sign you in as a broker and a personal email as a client. We are not building that. The sign in and create account form is visual only.
- Below the form, the portal has a section called MVP demo direct pipeline (no auth needed) with two buttons that log you in as a demo broker or a demo client and redirect to the matching dashboard.
- base.css holds the colour variables and common styles, and data.js holds the sample data. Every page loads them.
- Data lives in localStorage. The demo runs as two browser windows on one laptop, one phone sized for the client and one desktop sized for the broker. Demoing across separate devices is not supported.
- Reminders appear as in-app notifications. A skip ahead button on the broker dashboard moves the demo date forward so reminders fire in front of the judges.
- Shared goals belong to two spouses.
- The insurer has no login. The broker advances the claim steps on the insurer's behalf, and each step shows whose turn it is.
- Provider information is one simple directory page inside the broker dashboard.
- Reminders, insurers, claim steps and request types are stored as data in data.js, not written into the code, so a new one is a new row.

## Must have

Shared

1. data.js with the sample clients, goals, reminders, insurers, claims and claim steps.
2. base.css with the colour variables and common styles.

Landing and portal

1. Landing page with the logo, a hero section and a login button.
2. Portal with a sign in and create account form (visual only) and the demo pipeline buttons for broker and client.

Client dashboard

1. Balance sheet form, computed net worth and an assets versus liabilities chart.
2. Goals with progress bars, including a shared goal for spouses.
3. Notification feed for reminders addressed to the client, plus outstanding documents.
4. Report an accident screen with the scene checklist and a 48-hour police reminder.
5. Register a motor claim form with an insurer picker and photo upload previews.
6. Claim tracker showing the ten steps and whose turn each one is.

Broker dashboard

1. Client list showing each client's documents and claims.
2. Client detail with a net worth summary and goals, where the broker can add a goal.
3. Reminder rules with a trigger date, recurrence and recipient (client, broker or both), a notification feed for the broker, and the skip ahead button.
4. Claims list and claim tracker, where the broker advances each step.
5. Provider directory.

## If time allows

- Document signing: the broker requests a document, and the client signs by typing their name or uploads a signed copy that the broker can see.
- One generic request form, driven by data, that covers the other tasks in the brief.
- A mock "send to Santam" button that shows the payload it would send.
- An activity log of who did what and when.
- Voice note and camera capture at the accident scene.

## Later (do not build)

Real authentication, real email or SMS, real provider integrations, cross-device data, an installable app.

## Who does what

Suggested split, to confirm as a team:

- Person A: landing page, portal and the client dashboard (balance sheet, net worth, goals).
- Person B: client accident and claim forms and the claim tracker.
- Person C: broker client list and client detail.
- Person D: broker reminders, claims and provider directory.

Agree the shape of data.js together in the first hour, before anyone builds screens.
