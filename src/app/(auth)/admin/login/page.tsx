import { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Administrator Sign In | EduNova IMS Governance Console",
  description:
    "Restricted administrative sign in portal for authorized institutional executives and IT controllers at Kishoreganj Polytechnic Institute.",
};

export default function AdminLoginPage() {
  return (
    <AuthLayout
      title="Institutional Governance Console"
      subtitle="Exclusive security perimeter for Kishoreganj Polytechnic Institute administrators. Manage students, faculty approvals, departments, and system integrity."
      mode="login"
      visualHeadline="Institutional Governance & Security Perimeter"
      visualSubheadline="Administrative controls for student registries, faculty credentials, and campus data management."
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
