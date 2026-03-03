# Grading System UI

## Current State
Fresh project with a default Motoko backend and a blank React/TypeScript frontend. No components, pages, or data models exist yet.

## Requested Changes (Diff)

### Add
- **Login component**: Role-based login form (Admin, Faculty, Student roles). After login, route to the appropriate page.
- **Dashboard component**: Overview cards showing total students, subjects, recent activity.
- **AddStudent component**: Form to add a new student (name, ID, class/grade, contact info).
- **AddMarks component**: Form to assign marks to a student per subject and exam type.
- **ReportCard component**: Display a student's marks across subjects with calculated grades and totals.
- **Analytics component**: Charts/visualizations for class performance, subject averages, pass/fail rates.
- **AdminPage**: Full access -- Dashboard, AddStudent, AddMarks, ReportCard, Analytics.
- **FacultyPage**: Access to Dashboard, AddMarks, ReportCard, Analytics.
- **StudentPage**: Access to own ReportCard only.
- **api.js (services)**: Frontend service layer wrapping all backend actor calls.
- Backend data models: Student, Mark, Subject, User roles.
- Backend API: addStudent, getStudents, addMarks, getMarks, getReportCard, getAnalytics.

### Modify
- App.tsx: Add routing logic based on user role after login.

### Remove
- Nothing existing to remove.

## Implementation Plan
1. Generate Motoko backend with Student, Mark, Subject, and User role models plus CRUD endpoints.
2. Build frontend:
   - Login page with role selector and credential fields.
   - AdminPage with sidebar nav linking Dashboard, AddStudent, AddMarks, ReportCard, Analytics.
   - FacultyPage with restricted nav (Dashboard, AddMarks, ReportCard, Analytics).
   - StudentPage showing only the logged-in student's ReportCard.
   - Implement all six components with forms, tables, and charts.
   - Wire api.ts service layer to backend actor calls.
   - Implement role-based routing in App.tsx.
