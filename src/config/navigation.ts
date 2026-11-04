export interface NavSubItem {
  name: string;
  href: string;
  description?: string;
}

export interface NavItem {
  name: string;
  href: string;
  children?: NavSubItem[];
}

export const TOP_BAR_CONFIG = {
  phone: "+880 1711-100001",
  email: "info@edunova.ac.bd",
  location: "Karimganj, Kishoreganj, Bangladesh",
  officeHours: "Sun - Thu: 9:00 AM - 5:00 PM",
};

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Departments",
    href: "/departments",
    children: [
      {
        name: "Computer Science & Technology",
        href: "/departments/cst",
        description: "Software engineering, networking, AI, and systems",
      },
      {
        name: "Electrical Technology",
        href: "/departments/et",
        description: "Power grids, electrical machines, and industrial automation",
      },
      {
        name: "Civil Technology",
        href: "/departments/ct",
        description: "Structural engineering, surveying, and materials",
      },
      {
        name: "Mechanical Technology",
        href: "/departments/mt",
        description: "Thermodynamics, CNC manufacturing, and mechatronics",
      },
    ],
  },
  {
    name: "People",
    href: "/people",
    children: [
      {
        name: "Leadership & Administration",
        href: "/people/leadership",
        description: "Principal, Vice-Principal & academic steering council",
      },
      {
        name: "Department Heads",
        href: "/people/department-heads",
        description: "Chief instructors steering technical departments",
      },
      {
        name: "Teachers & Staff",
        href: "/people/faculty-staff",
        description: "Instructors, lab facilitators, and administrative staff",
      },
    ],
  },
  {
    name: "Academics",
    href: "/academics",
    children: [
      {
        name: "Class Routine",
        href: "/academics/routine",
        description: "Shift-wise schedules for 1st through 8th semesters",
      },
      {
        name: "Academic Calendar",
        href: "/academics/calendar",
        description: "Semester timelines, examinations, and term breaks",
      },
      {
        name: "Academic Resources",
        href: "/academics/resources",
        description: "Syllabi, lecture notes, lab manuals, and downloads",
      },
    ],
  },
  {
    name: "Campus",
    href: "/campus",
    children: [
      {
        name: "Campus Facilities",
        href: "/campus/facilities",
        description: "Computing labs, workshops, central library, and auditorium",
      },
      {
        name: "Photo Gallery",
        href: "/campus/gallery",
        description: "Verified institutional life, seminars, and technical events",
      },
      {
        name: "Campus Life",
        href: "/campus/life",
        description: "Student clubs, robotics society, sports, and culture",
      },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export const FOOTER_CONFIG = {
  about:
    "EduNova is an enterprise digital campus platform purpose-built for polytechnic institutes, providing integrated academic governance, student management, and digital learning workflows.",
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Claim Student Account", href: "/claim-account" },
    { name: "About Institute", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "People Directory", href: "/people" },
  ],
  academicLinks: [
    { name: "Class Routine", href: "/academics/routine" },
    { name: "Academic Calendar", href: "/academics/calendar" },
    { name: "Resources & Syllabi", href: "/academics/resources" },
    { name: "Campus Facilities", href: "/campus/facilities" },
  ],
  developer: {
    name: "Md Salman Hossain",
    title: "Full Stack Developer",
    bio: "Passionate software engineer building resilient academic management systems and modern web architectures.",
    github: "https://github.com/salman-hossain",
    portfolio: "https://salmanhossain.dev",
    meetLink: "/developer",
  },
};

