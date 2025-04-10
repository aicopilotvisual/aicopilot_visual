import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - AI Copilot",
  description: "Design and visualize your automation workflows with AI assistance",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}