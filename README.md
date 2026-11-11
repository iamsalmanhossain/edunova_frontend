# EduNova — Digital Campus Platform
**Kishoreganj Polytechnic Institute (KIPI)**

EduNova is a full-featured digital institutional management system engineered for technical polytechnic education in Bangladesh under the Bangladesh Technical Education Board (BTEB) curriculum.

---

## 🌟 Key Features

### 🏛️ Institutional Governance (Admin Console)
- **Department & Curriculum Management**: Configure departments (CST, ENT, Food, RAC) and 7-semester diploma sequences.
- **Faculty Management**: Approve, reject, review profiles, and soft-delete faculty members.
- **Student Enrollment**: Complete student directory, roll/registration search, and status administration.
- **Institutional Analytics**: Real-time KPI summaries covering students, teachers, departments, and active semesters.

### 👨‍🏫 Faculty Portal (Teacher Dashboard)
- **Interactive Roll Call**: Rapid attendance marking (Present, Absent, Late) with single-click bulk toggles.
- **Attendance Register Matrix**: Full semester tabular view with date columns and instant CSV/Excel export.
- **Continuous Assessment & Exams**: Real-time marks submission with automatic BTEB letter grade & GP calculation.
- **Master Subject Overview**: Detailed breakdown between Theory and Practical attendance rates.
- **Classroom Diary**: Daily topic logging, assignments, and announcements.

### 🎓 Student Portal
- **Attendance Tracker**: Real-time attendance percentage breakdown per subject with visual status indicators.
- **Results & Grade Sheets**: View published examination marks and printable semester grade sheets.
- **Profile & Credentials**: Claim accounts, view enrolled department, shift, and semester info.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide Icons
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Export**: Native RFC 4180 CSV engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- pnpm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/iamsalmanhossain/edunova_frontend.git

# Navigate to project directory
cd edunova_frontend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 License
All rights reserved © Kishoreganj Polytechnic Institute & Md Salman Hossain.
