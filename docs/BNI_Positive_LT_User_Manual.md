# BNI Positive LT System – User Manual

**Version**: Phase 1 MVP  
**Last Updated**: 21 November 2026

## 1. Accessing the System
- Open the live URL provided by Vercel (or your custom domain once connected).
- Use the **Login** page (any email/password works in the current demo version).

## 2. Navigation
The left sidebar provides access to all modules:
- **Dashboard** – Overview of chapter stats
- **Calendar** – View and add events
- **Members** – View and add members
- **Tasks** – Track LT team tasks
- **Traffic Lights** – Score calculator
- **Reports** – Upload BNI Connect CSV files
- **Presentations** – Archive of 5-min and Gains presentations
- **Seating Plans** – 萬怡酒店 floor plan overview
- **Activities** – Chapter events and workshops

## 3. Key Features

### Tasks
- Click **+ Add Task** to create a new task.
- Use the status dropdown to mark a task as Pending, In Progress, or Done.
- Data is saved in your browser.

### Members
- Click **+ Add Member** to add a member.
- Enter name, category, and score. Status (Green/Yellow/Red) is calculated automatically.
- Data is saved in your browser.

### Calendar
- Click **+ Add Event** to create a new event.
- Choose date, title, and type (Training, Meeting, Rehearsal, Social, Birthday).
- Events are color-coded.

### Traffic Lights
- Adjust the sliders to see current or projected scores.
- Green = 70+ points.

### Reports
- Upload a CSV export from BNI Connect.
- The system shows a preview of the first 20 rows.

### Seating Plans
- Displays the current 萬怡酒店 table structure (Visitor Tables and Category Tables).

## 4. Data Persistence
Tasks and Members are stored in your browser’s local storage. Clearing browser data will reset them. A server database is planned for multi-user use.

## 5. Current Limitations (Phase 1)
- Login is demo-only (no real authentication yet).
- Report upload is preview-only (full parsing coming next).
- Seating plan is view-only (interactive editor planned).
- No multi-user real-time sync yet.

## 6. Next Planned Features
- Full Excel/CSV parsing that updates Traffic Lights automatically
- Server-side database
- Role-based access (Admin / Leader / Member)
- Interactive seating assignment
- Presentation file upload

For support or feature requests, contact the project coordinator.
