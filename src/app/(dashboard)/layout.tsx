// This layout is intentionally minimal.
// Each role (learn, teach, admin) has its own dedicated layout with its own sidebar.
// This shared layout only provides common wrappers if needed.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
