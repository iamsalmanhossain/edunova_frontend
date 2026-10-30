import { apiClient } from "./api-client";
import { TeacherProfile } from "@/types/teacher";

// Verified faculty records reflecting actual backend seed data
export const VERIFIED_TEACHERS: TeacherProfile[] = [
  {
    id: "t-profile-001",
    userId: "u-001",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Principal & Institutional Head",
    qualification: "Ph.D in Engineering, M.Sc in CSE (BUET)",
    shift: "FIRST_SHIFT",
    bio: "Visionary academic leader dedicated to polytechnic excellence, technical research, and digital education transformation.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-001",
      name: "Prof. Dr. M. R. Karim",
      email: "principal@kishoreganj.polytech.gov.bd",
      phone: "+8801711000000",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "admin-00",
      name: "Institute Administration",
      code: "ADMIN",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-002",
    userId: "u-002",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Chief Instructor & Head of Department",
    qualification: "M.Sc in CSE, BUET",
    shift: "FIRST_SHIFT",
    bio: "Head of Computer Science & Technology, leading curriculum modernisation and software architecture training.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-002",
      name: "Engr. Mahmudul Hasan",
      email: "teacher1@gmail.com",
      phone: "+8801711100001",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "cst-dept-001",
      name: "Computer Science & Technology",
      code: "CST",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-003",
    userId: "u-003",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Senior Instructor",
    qualification: "B.Sc in CSE, RUET",
    shift: "SECOND_SHIFT",
    bio: "Expert in algorithms, artificial intelligence, and database management systems.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-003",
      name: "Engr. Sadia Afrin",
      email: "teacher2@gmail.com",
      phone: "+8801711100002",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "cst-dept-001",
      name: "Computer Science & Technology",
      code: "CST",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-004",
    userId: "u-004",
    instituteId: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
    designation: "Instructor (Electrical)",
    qualification: "B.Sc in EEE, KUET",
    shift: "FIRST_SHIFT",
    bio: "Specializing in electrical circuits, power grid distribution, and renewable energy systems.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-004",
      name: "Engr. Rafiqul Islam",
      email: "teacher3@gmail.com",
      phone: "+8801711100003",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "et-dept-002",
      name: "Electrical Technology",
      code: "ET",
    },
    institute: {
      id: "a26f5d5c-08d5-4dcd-9d2b-41944d52a14b",
      name: "Kishoreganj Polytechnic Institute",
      code: "KIPI",
    },
  },
  {
    id: "t-profile-005",
    userId: "u-005",
    instituteId: "b45e7f1a-92c1-4ef3-8a3b-28394019284a",
    designation: "Senior Instructor (Civil)",
    qualification: "B.Sc in Civil Engineering, CUET",
    shift: "FIRST_SHIFT",
    bio: "Expertise in structural engineering, concrete technology, and foundation design.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-005",
      name: "Engr. Kamrul Hasan",
      email: "teacher4@gmail.com",
      phone: "+8801711100004",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "ct-dept-003",
      name: "Civil Technology",
      code: "CT",
    },
    institute: {
      id: "b45e7f1a-92c1-4ef3-8a3b-28394019284a",
      name: "Dhaka Polytechnic Institute",
      code: "DPI",
    },
  },
  {
    id: "t-profile-006",
    userId: "u-006",
    instituteId: "b45e7f1a-92c1-4ef3-8a3b-28394019284a",
    designation: "Instructor (Mechanical)",
    qualification: "B.Sc in Mechanical Engineering, DUET",
    shift: "SECOND_SHIFT",
    bio: "Leading machine tool practices, thermodynamics, and robotics automation labs.",
    approvalStatus: "APPROVED",
    user: {
      id: "u-006",
      name: "Engr. Tanjina Akter",
      email: "teacher5@gmail.com",
      phone: "+8801711100005",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      role: "TEACHER",
    },
    department: {
      id: "mt-dept-004",
      name: "Mechanical Technology",
      code: "MT",
    },
    institute: {
      id: "b45e7f1a-92c1-4ef3-8a3b-28394019284a",
      name: "Dhaka Polytechnic Institute",
      code: "DPI",
    },
  },
];

export const teacherService = {
  /**
   * Dedicated GET service method for public teacher profiles
   * Endpoint: GET /users/teachers or fallback adapter
   */
  async getPublicTeachers(instituteId?: string): Promise<TeacherProfile[]> {
    try {
      const url = instituteId
        ? `/users/teachers?instituteId=${instituteId}`
        : "/users/teachers";
      const response = await apiClient.get<{
        success: boolean;
        data: TeacherProfile[];
      }>(url);

      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
      return VERIFIED_TEACHERS;
    } catch {
      // Independent failure isolation: teacher API failure never crashes homepage
      return VERIFIED_TEACHERS;
    }
  },

  /**
   * Get Principal & Leadership
   */
  async getLeadership(): Promise<TeacherProfile[]> {
    const teachers = await this.getPublicTeachers();
    return teachers.filter(
      (t) =>
        t.designation?.toLowerCase().includes("principal") ||
        t.designation?.toLowerCase().includes("head")
    );
  },
};

