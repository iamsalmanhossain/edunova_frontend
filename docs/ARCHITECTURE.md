# EduNova Frontend Architecture

EduNova is a modern, enterprise-grade digital campus management web application built for Kishoreganj Polytechnic Institute (KIPI) following the Bangladesh Technical Education Board (BTEB) 7-semester diploma sequence.

## Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **Animation**: Framer Motion
- **State Management**: Zustand (Auth, Confirm, Toast)
- **API Communication**: Native Fetch with Silent JWT Auto-Refresh (`api-client.ts`)

## Role-Based Architecture

The application enforces strict role segregation:
- **Admin Portal (`/dashboard/admin`)**:
  - Faculty directory & verification workflows (approve/reject/soft-delete)
  - Student records management & academic enrollment
  - Department, semester, and curriculum configuration
- **Faculty Portal (`/dashboard/teacher`)**:
  - Live session roll call & attendance register matrix
  - Continuous assessment & exam marks grading with automatic BTEB grade scale
  - Subject master overview with theory & practical breakdown
  - Classroom diary entries & routine management
- **Student Portal (`/dashboard/student`)**:
  - Semester-wise attendance summaries & visual progress
  - Examination results and GPA / CGPA marksheets
  - Profile claiming and credentials management

## Key Architectural Patterns

1. **Hydration-Safe Client Skeletons**:
   Layout guards (`DashboardGuard.tsx`) avoid hydration flashes by serving server-safe layout structures before state mounting.
2. **Resilient Session Termination**:
   Logout uses race timeouts with background server notification, clearing localStorage immediately to guarantee instant and secure redirection.
3. **Responsive Grid & Pagination**:
   Shared components adapt between desktop data tables and compact mobile card layouts.
