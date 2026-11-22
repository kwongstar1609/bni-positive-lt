BNI Positive — download package
================================

This zip contains the Leadership Desk app source plus the latest requirements.

After unzipping, open the folder bni-positive-leadership-desk.
package.json sits next to src/ and public/.

Deploy
- New empty GitHub repository (do not mix with an old Next.js repo).
- Upload the contents of bni-positive-leadership-desk (not the zip itself).
- Vercel: import the repo, leave Root Directory and Output Directory blank.
- Build command: npm run build
- No environment variables. Data is stored in the browser.
- node_modules is not included. Vercel runs npm install. Locally: npm install && npm run dev

Pages in this build
dashboard, members, member detail, traffic lights, reports import,
applications, visitors, seating, presentations, calendar, tasks, manual.

Docs inside docs/
- BNI_Positive_LT_System_Requirements.md  (v1.5)
- BNI_Positive_LT_User_Manual.md
- BNI_Positive_LT_Build_Summary.md

Not built into the pages yet
Referral dashboard, follow-up reminders, and level-of-referral tagging
are documented in requirements v1.5 and are not in the source yet.
BNI Connect remains the official source of truth.
