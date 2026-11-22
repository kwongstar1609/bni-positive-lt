# BNI Positive Chapter – Internal Leadership Team Operations System
## Requirements & Discussion Record

**Chapter**: BNI Positive (Hong Kong) – wearepositive.hk  
**Scale**: 100+ members (recent Chapter Traffic Lights show ~96)  
**Purpose**: Internal operations platform for Leadership Team (LT) roles to coordinate processes, track progress, manage tasks, and complement BNI Connect.  
**Status**: Requirements gathering phase (pre-build). Document will be updated after each discussion.  
**Version**: 1.5 (Updated 22 Nov 2026 – added BNI Referral Tracking research and recommended system features)  
**Next**: User answers remaining team questions → revised requirements → design → build versions

---

## 1. High-Level Goals
- Single source of truth for LT internal processes, tasks, schedules, and status.
- Clear dashboard showing member stats, pending items, votes, and team tasks.
- Role/team-based task assignment with completion tracking and reminders.
- Calendar / timetable views for schedules (speakers, presentations, events, meetings, reviews).
- Ability to import/parse BNI Connect reports and refresh internal data.
- Fully customizable backend (teams, roles, tasks, workflows) because LT changes every ~6 months.
- Support for regular team meetings, post-meeting reviews, DNA reviews, and each team’s reviews.
- Member-facing or LT-visible Green Light / Traffic Lights calculator with forward-looking projections.
- Can be hosted on the same domain as wearepositive.hk or as an internal portal linked to it.
- Complements (does not replace) BNI Connect for official referrals, attendance, applications, etc.
- Support visualization of chapter-level goals, traffic lights, and rankings.

## 2. Core Modules & Features

### 2.1 Dashboard & Member Stats
- Chapter-wide and role-specific views.
- Member statistics refreshed from Connect report imports (PALMS-derived activity, attendance, referrals, etc.).
- Pending items overview (applications, renewals, payments, tasks).
- Votes / decision status (e.g., MC on applications).
- Traffic Lights / Green Light status summary and filters (member and chapter level).
- Outstanding tasks by team/role.
- Chapter goals progress (size, visitors, referrals, conversion, retention, etc.).
- TYFCB distribution by traffic light color.
- Regional/member ranking views.

### 2.2 Task Engine
- Configurable task templates per role/team.
- Weekly recurring and ad-hoc tasks.
- Assignment to individuals or sub-committees.
- Status tracking: pending / in progress / done / outstanding.
- Leader visibility into completion.
- Notifications / reminders for responsible people.
- Examples:
  - ST: organise presentation rehearsals; schedule next 5-min presentations and speaker rotation.
  - Visitor Hosts: seating plans, enrollment cross-checks, pre/post follow-ups.
  - MC/VP: process applications, renewals, PALMS-related follow-ups.
  - Green Light: review scores and coach members.
  - CGC: activities, posters, WhatsApp updates, enrollments.

### 2.3 Calendar & Timetable
- Unified **central calendar** with color coding and filters for different activity types.
- Categories / color codes (configurable), for example:
  - Official BNI training / workshops / MSP / MC sessions
  - Chapter meetings (live, hybrid, Zoom)
  - International events / conferences
  - LT meetings and reviews
  - Speaker / presentation rehearsals
  - Internal chapter social activities (team dinners, gatherings, special days, celebrations)
  - Member birthdays and anniversaries
  - Other chapter-organized events
- Speaker roster and presentation schedule (featured + 5-min).
- Rehearsals, visitor days, events, LT meetings, reviews.
- Filterable by team/role or activity type.
- Integration points with task system and event enrollment tracking.
- Support for both official and informal internal activities so everyone has one shared view.

### 2.4 Team & Role Management
- Define teams, sub-committees, leaders, and responsibilities.
- Easy restructure when LT changes every 6 months.
- Role-based access.
- Track who is responsible for what and whether required tasks are completed.

### 2.5 BNI Connect Integration
- Upload/import of Connect exports (Summary PALMS, Roster, Visitor reports, Chapter/Member Traffic Lights, rankings, etc.).
- Parse and update internal member activity, attendance, renewals due, etc.
- Refresh dashboards without full manual re-entry.
- Connect remains source of truth for official data.

### 2.6 Reviews & Meeting Support
- Structured notes / action items for:
  - Post-meeting reviews
  - DNA reviews (with Director Consultant / Ambassador support)
  - Individual team reviews
  - Regular LT meetings
- Action items feed into the task system.
- Support for generating or tracking monthly LT meeting agendas similar to historical forms.

### 2.7 Green Light / Member Traffic Lights Calculator
- Full calculation engine based on current BNI Member Traffic Lights rules (100-point system).
- Rolling window (standard ~6-month; configurable to 5-month if needed).
- Per-member current score, color, and metric breakdown.
- Forward projection: what activity is needed next month (accounting for rolling drop-off) to sustain Green or hit specific targets (70, 75, 80, 85, 90, 95, 100).
- Personal view for each member + leadership views for coaching.
- Configurable thresholds and annual fee (for TYFCB ratio) to handle regional variations.
- Chapter-level Traffic Lights tracking and forecasts.

**Current Scoring Reference (to be confirmed/configurable):**
- Participation (40): Attendance (10), 1-2-1s (20), CEUs (10)
- Contribution (60): Referrals Given (25), Visitors (25), Sponsorship (5), TYFCB (5)
- Colors: Green 70+, Yellow 50–69, Red 30–49, Gray <30

### 2.8 Additional Supporting Features (to be prioritised)
- Visual seating / floor-plan support with enrollment cross-check.
- Finance / payment status overview (chapter fees, etc.).
- Template library (WhatsApp messages, posters, announcements, Canva-linked presentation materials).
- Custom forms (happiness/check-in, 7-month reviews, etc.).
- Application / renewal pipeline tracking.
- Event / activity planning support for CGC (central archive with photos, messages, templates).
- Goals tracking dashboard based on Team Goals spreadsheet structure.
- Priority recruitment categories list (5–10 industries).
- Warning letters / actions tracking (from MC reports).
- Audio/video clips for 5-min presentations and 20-sec promotions.

## 3. Roles Covered (Customizable)
- President
- Vice President
- Secretary/Treasurer (ST)
- Membership Committee (MC) chairs
- Chapter Growth Coordinator (CGC)
- Visitor Host Coordinator + team
- Mentor Coordinator
- Green Light / Traffic Light Coordinator
- Education Coordinator
- Webmaster / Communications
- International Business Coordinator
- Other sub-committees as defined by chapter

## 4. Technical & Hosting Notes
- Prefer internal use on or linked to wearepositive.hk domain.
- Existing public member directory on site; internal login/section already referenced.
- Role-based access (proposed: Administrator, Leader edit+read, Member view-only).
- Customizable data model and workflows (priority).
- Phased build expected (will not be complete in one go).
- Report parsing from Excel/CSV/PDF exports.
- Possible Canva integration or link management for presentation slides (Webmaster / International teams).

## 5. Process Notes from Research & Discussion

### Secretary/Treasurer (ST) – Presentations & Rehearsals
- Currently managed via Excel.
- Members update and contact others based on last presentation timeslot.
- Factors considered: comfort with live vs Zoom presentation, and ability to bring visitors.
- Rehearsal process: ST Sub-com creates a WhatsApp group and adds members due to present each week.
- Suggestion: provide more lead time (e.g., 5–6 weeks in advance) to lock in rehearsal schedules.
- Rehearsals mainly on weekdays/weeknights, sometimes weekend nights; members often prefer to do all rehearsals at once.
- Purpose of rehearsal: ensure presentation content does not overlap other members’ specialties, avoid non-related specialty topics or internal conflicts, and confirm members are competent with clear and relevant content.
- Tracking currently done by someone maintaining Excel (members, dates, etc.).
- Access currently limited; preferred that any LT or members can view the schedule themselves rather than relying on 10+ different WhatsApp groups or checking files online.

### Visitor Hosts – Seating, Guests & Attendance
- Seating arrangements currently done last-minute by VH Team.
- Challenge: often lack full picture on how many people are coming and visitor interest level.
- Visitor rating system used by members: scores indicating level of interest, how much they know about BNI, how hungry they are to join, desire for more business, etc.
- Live meeting venue is fixed (locked in every 6 months) at 萬怡酒店.
- **Current floor plan structure (萬怡酒店)**:
  - Multiple tables with designated roles:
    - Visitor Tables (yellow header): Table 1, Table 2, Table 3, Table 5, Table 6 — typically 8 persons
    - Category tables (blue header): Table 7 (MS, CS), Table 8 (FR, IT), Table 9 (CE, LF), Table 10 (FB, MP), Table 11 (ET + Sub)
    - Special areas: Entrance, D&A, Observer seats, Mic Runner, 演講計時
  - Visitors are often seated with members from related or complementary categories to encourage business conversations.
  - Tables show member names, visitor codes (e.g. V01, V06), and sometimes category notes.
- Attendance tracked by ST team and Webmaster team via registration forms, on-the-day payment, and QR code recording upon arrival.
- Process sometimes requires manual adjustments; performed by team members.

### Membership Committee (MC) – Applications, Voting & Renewals
- Application received and interview done through official BNI forms.
- Passed to VP for review.
- Communications handled via WhatsApp groups: one with MCC members and another with potential new members.
- Interview reports updated with findings and summary, then shared in the MCC WhatsApp group.
- Voting: Generate a link from Strawpoll website for the team to vote.
- Votes are anonymous among team members; VP can see who voted for and against.
- Results used to confirm approval.
- Renewal process: Manual outreach a few months in advance based on member tracking.
- Contact member to complete happiness form.
- Closer to renewal: Meet with member to discuss current status, intentions, further discussions.
- Final steps: Fill form, make payment, and confirm renewal.
- Key Connect reports used for decisions: Member status over past 8–10 months, attendance, traffic lights, whether member is generating business / making money, perceived value of BNI, feedback, and future goals.
- Additional system need: Keep record of all past 5-minute presentations and latest 20-second promotion updates. Ideal if website can host audio clips of presentations.
- Common bottlenecks: Work stops without visibility if one person is busy (others assume progress is being made). Leads to missed deadlines and chasing. Need shared platform for clear status, visualization, and automated triggers/reminders/alerts/warnings.
- Historical MC monthly report forms track: visitor numbers and trends, Summary PALMS, attendance/substitutes/absences/lates with special attention lists, chapter growth, complaints, new applications, renewals in 3 months, actions taken (warning letters, probation, category openings, medical leave, next recruitment), categories needed, recommendations to President, education topics.
- **Interview process**: Uses official Membership Committee Interview Script (Chinese version, ~30–45 minutes).  
  - Part 1 (business background): Business type, years in business, main clients, unique selling points, company goals, target growth, preferred training, success definition, views on helping others.  
  - Part 2 (BNI Five Fundamentals): Commitment to weekly attendance (and substitutes ≤3 per 6 months), early arrival, business attire, willingness to train (MSP, LT+Members Forum, workshops), 1-2-1s, referrals follow-up within 24 hours, inviting visitors, and building a larger team.  
  - Internal MC section: Team comments, reference checks (2 customers), decision (Approve / Not suitable) with reason, CC to Vice President.  
  - System opportunity: Digital interview form with structured questions, notes capture, and direct link to voting workflow.
- **Member Policy highlights relevant to workflows**: One category per chapter; max 3 absences in 6 months (substitutes allowed); fees due 30 days before expiry; new members must complete MSP within 30 days; category change requires new application + MC approval; data used only for referrals with consent; MC has final decision authority on policy compliance (including probation or opening category).
- **Application Form structure** (official Chinese form 20250601):  
  - Part 1: Chapter, date, applicant name, company, position, contact address, category, sponsor, email, phones, product/service description.  
  - Part 2: Business scope/experience, education/professional qualifications.  
  - Part 3: Full-time vs part-time, years in company, commitment to early arrival and full meeting, ability to find substitute, contribution type, quality of referrals/visitors, prior BNI membership, other referral organisations, bankruptcy/criminal record.  
  - Part 4: Two business references.  
  - Part 5: Fees (example: registration HKD 2,600 + annual 1-year HKD 8,500 / 2-year HKD 16,000).  
  - Part 6: Payment methods (PayMe, FPS/bank transfer, cheque, credit card).  
  - Common issues noted in guides: incomplete fields, missing signatures (must be handwritten), missing payment proof, using old forms.  
  - System opportunity: Digital application intake with validation, status tracking, and linkage to interview + voting.
- Supporting guides available: Form-filling & payment methods guide, Online Renewal & Payment via BNI Connect, Forgot Username/Password, Account Locked, and Chinese Q&A materials.
- **Positive chapter member list**: Categorized by industry groups (e.g., MS 醫療健康及運動, LE 生活品味及家庭服務, CS 專業及企業服務, and others). Useful for seating, networking, and priority recruitment views.
- **Member Traffic Lights (Positive, May 2026 example)**: Full 6-month rolling data with per-member P/A/L/M/S/G/R/V/1-2-1/T/Biz Give breakdowns and total points. Summary: ~50 Green, 13 Yellow, 26 Red+Black. Scoring rules detailed (attendance, punctuality, referrals/week, visitors/week, 1-2-1, training, TYFCB thresholds). TYFCB heavily concentrated in Green members.
- **Priority industry vacancy list** (BOD/VFD example): Categorized open categories (FB, MS, FR+CE, CS) with starred priority targets for recruitment. System opportunity: maintainable priority list that feeds Visitor Hosts and MC reports.
- **Member testimonial video contest** (BNI HK International Conference 2026): Chapter-level internal selection of top videos, upload process, and theme around accelerating business growth via BNI. System opportunity: track submissions and internal shortlisting.
- **Member grouping example**: Members assigned to groups (e.g., for activities, seating, or Power Teams).
- **Presentation order examples**: Grouped by industry category (e.g., MS 醫療健康及運動 Group A) for physical meetings. System opportunity: digital speaker roster and rehearsal tracking with category grouping.
- **Seating plans**: Detailed table arrangements for live meetings (e.g., 萬怡酒店 examples Jan/Mar 2026) showing fixed floorplan, category-based tables, visitor tables, substitutes, observers, D&A, Mic Runner, and entrance/stage layout. Reinforces need for visual seating tool with enrollment cross-check and last-minute adjustments.
- **1-2-1 meeting worksheet**: Official plan including member profile, contact scope, gains table, and top 10 clients. System opportunity: digital 1-2-1 scheduling and notes linked to member profiles.
- **Gains Profile example**: Member presentation template (e.g., Sue and Almond Pain Care). Complements existing need for recording past 5-min presentations and 20-sec promotions.
- **Dance Card**: Networking tool for events. Potential digital version or tracking for CGC activities.
- **VIP visit agenda example**: Structured event schedule (e.g., SEYO Sept 2026). Supports CGC activity archive and enrollment tracking.
- **Zoom breakout / room assignments**: Digital meeting logistics for hybrid or online sessions.
- **GAINS form**: Official template covering Goals, Accomplishments, Interests, Networks, and Skills. Complements Gains Profile presentations and member profiling.
- **5-minute feature presentation tips**: Suggested 10-page PPT structure (Self Intro/Story, Goal, Accomplishment, Interest, Network and Skills, Product/Service, Ask Question, Why Me?, Contact Sphere & Top 10 Clients, Remind Referral Partners). Reinforces need for presentation archive with templates and audio/video clips.
- **Sample 5-min speech**: Example structured script (e.g., Noelle Lee – beauty products) covering personal story, goals, products, differentiation, requested referral types, and call-to-action. System opportunity: library of past presentations and templates for ST team and members.
- **Zoom support materials**: Rename guide for consistent participant naming in hybrid/online meetings.
- **Additional member presentation examples**: Samples covering various businesses (e.g., Rony Suen – charitable social enterprise / SME incubator; Angel Lee – mainland new media & personal IP; Jeff Hon – financial advisory, employee benefits & insurance; Paul Mak – Outdoor Experience Training Centre adventure training). Reinforces need for a searchable presentation library (PPT/PDF uploads, optional audio/video clips) linked to member profiles, accessible to ST team for rehearsal and to members for reference.

### Referral Tracking (BNI Connect + Chapter Practices)
**Official Process (BNI Connect)**
- Referrals are logged as slips (paper or electronic). Electronic entry immediately notifies the recipient and is included in the week’s PALMS only after the VP submits the report.
- Types: Inside (self or household) vs Outside (third-party).
- Five Levels of a Referral (Referral Continuum):
  1. Name + contact (prospect expects contact)
  2. + Supplementary material (card/website/brochure)
  3. + Personal testimonial
  4. + Personal phone call arranging a meeting
  5. + In-person introduction
- Referral Tracking Sheet (received referrals): statuses include New, Pending, Closed, No Sale / Got the Business / Keep Confidential. Status updates are visible to the giver; private notes stay private. Marking “Got the Business” prompts a TYFCB slip. Tracking sheet changes do **not** affect PALMS.
- Key reports: Received Referrals, My Referrals, Slips Audit Report (VP), Summary PALMS (RGI+RGO), Roster (G/R columns).

**Scoring Impact**
- Referrals Given is a major component of Member Traffic Lights (typically up to 25 points).
- Calculated as weekly average over the previous completed ~6-month period (countable weeks = P+A+L+S; Managed excluded).
- Only counts after PALMS submission.
- TYFCB is a separate smaller score (up to 5 points) based on ratio to annual membership fee.

**Common Pain Points**
- Forgotten status updates and TYFCB logging.
- Paper + electronic reconciliation burden on VP.
- Limited chapter-level visibility into open referrals and follow-up lag.
- Referral quality (level) rarely tracked systematically.
- Follow-up scattered across WhatsApp.

**Recommended Internal System Features**
- Referral dashboard (chapter + personal): given/received, open vs closed, average level.
- Status & follow-up tracker with reminders (“no update in X days”).
- Optional Level of Referral (1–5) tagging.
- TYFCB linkage visibility (value remains private).
- Connect report import (Summary PALMS + Slips Audit) to keep internal numbers in sync.
- Coaching views for low volume or poor follow-up.
- Filters by Power Team / industry category.

Connect remains the official source of truth; the internal system provides operational visibility and coaching support.

### Green Light Coordinator
- A couple of members are assigned to help new members and existing members whose lights are below score (Yellow, Red, Black) as well as some Green members who are on the edge.
- Not primarily coaching; focus is on encouraging attendance at official BNI training classes.
- There is a list of classes each month; members must go on the official site to register and make payments.
- Desired feature: Central location in the system where all classes are listed for easy access by members and leaders.
- Access proposal: Leaders (and designated roles) have edit + read access; regular members have view-only access to their own status and chapter resources. Administrator role for system configuration; optional developer-level access if needed later.

### Chapter Growth Coordinator (CGC)
- Main activities: Central place to keep all activities (past and future), including photos and messages. Serves as a long-term memory space for the chapter.
- Ability to upload, review, and load similar past activities for easier future administration and to save time/effort.
- Support for setting templates.
- Poster and WhatsApp message workflow: Yes (to be supported).
- Enrollment tracking for events: Yes (to be supported).

### Leadership Team Meetings & Goals Tracking (from uploaded forms)
- Monthly LT meeting agenda covers: chapter goals discussion (membership numbers, visitors, referrals) vs planned targets; update of top 5–10 priority recruitment categories; MC summary of applications, renewals, attendance, disputes; ST financial status update; other issues; LT concerns; actions required by BNI Director.
- Team Goals spreadsheet tracks (current / 6-month / 12-month targets + influencers): Revenue (TYFCB), Chapter Size, Members Growth, Visitors Per Week, Visitors Conversion, Training Per Member, Absenteeism, Referrals per Member per Week, Chapter Traffic Light, Retention, 1-2-1s.
- Chapter Traffic Lights reports include size, growth, retention, referrals, visitors, conversion, absenteeism, score, trend; with 6-month forecast formula (visitors × conversion × 25 weeks minus attrition).
- Positive chapter (Oct 2026 example): Size 96, Growth 7, Retention 73%, Referrals 1.54, Visitors 13.00, Conversion 3.53, Absenteeism 3.51, Score 90 (up from 75).
- TYFCB heavily concentrated in Green members (e.g., 83% of TYFCB from Green in one regional view).
- Regional and detailed Member Ranking reports used for performance visibility.

### Other Process Notes
- Weekly structured meeting (~20-point agenda).
- PALMS tracking and Traffic Lights as core accountability tools.
- Speaker rotation managed by ST (entered into Connect).
- Visitor journey: invitation → registration → follow-up → attendance → orientation → application.
- Renewals not automatic; performance review involved.
- Large-chapter logistics (seating, cross-checks) are high priority.
- Heavy use of WhatsApp for day-to-day; system should reduce silos and double-entry.
- International and Webmaster teams use Canva for presentation slides and information materials.

## 6. Open Items / Verification Questions by Team
*(Remaining questions – answers will update this document. Answered items moved to Section 5.)*

### Other Teams (Mentor, Education, International Business, Webmaster, President/VP)
- Primary weekly/monthly internal tasks?
- Key handoffs or dependencies with other teams?
- Existing tools or templates?
- Specific Canva workflows for International / Webmaster?

### General
- Which BNI Connect reports do you export most often and in what format?
- How are DNA reviews and post-meeting reviews currently run?
- Any existing shared spreadsheets, Google Sheets, or forms we should model?
- Priority features for the first usable version?

## 7. Version History
- **v0.1** (21 Nov 2026): Initial compilation from requirements discussions covering roles, processes, dashboard/tasks/calendar, Connect integration, Green Light calculator with projections, customizability for 6-month team changes, and review support.
- **v0.2** (21 Nov 2026): Added structured verification questions by team for deeper requirements gathering.
- **v0.3** (21 Nov 2026): Incorporated user details on ST presentation/rehearsal process and Visitor Hosts seating/attendance.
- **v0.4** (21 Nov 2026): Incorporated Membership Committee application, voting, renewal, and bottleneck details.
- **v0.5** (21 Nov 2026): Incorporated Green Light Coordinator and Chapter Growth Coordinator details.
- **v0.6–v0.9** (21 Nov 2026): Incorporated analysis of uploaded files including LT meeting agendas, Chapter Team Goals spreadsheet, Chapter/Member Traffic Lights reports, TYFCB charts, Regional & Member Rankings, MC Interview Script, Member Policy, MSP attendance lists, Membership Application Form + fee/payment guides, Positive categorized member list, detailed Member Traffic Lights export with scoring rules, priority industry vacancy lists, member testimonial video contest, and member grouping examples.
- **v1.0** (21 Nov 2026): Incorporated presentation order by industry group, detailed live seating plans (萬怡酒店 examples), 1-2-1 meeting worksheet structure, Gains Profile presentation example, Dance Card, VIP visit agenda, and Zoom breakout room notes.
- **v1.1** (21 Nov 2026): Incorporated official GAINS form (Goals, Accomplishments, Interests, Networks, Skills), 5-minute feature presentation tips (10-page structure), sample 5-min speech script, and Zoom rename guide.
- **v1.2** (21 Nov 2026): Incorporated additional member presentation and Gains Profile examples (Rony Suen, Angel Lee, Jeff Hon, Paul Mak) to support the presentation archive feature.
- **v1.3** (21 Nov 2026): Incorporated official training/workshop examples (MSP Member Success Program, MC Follow Up Workshop) and promotional materials for the 3 core guides, reinforcing central class/event listing and registration tracking.
- **v1.5** (22 Nov 2026): Added detailed research on BNI referral tracking (Connect Referral Tracking Sheet, statuses, Five Levels of a Referral, scoring impact, pain points) and recommended internal system features for visibility, follow-up, and coaching.

---

*This document is a living record. It will be updated after each discussion. Final pre-build version will be used for cross-check before development begins. Subsequent build versions will track what was implemented and what remains.*
