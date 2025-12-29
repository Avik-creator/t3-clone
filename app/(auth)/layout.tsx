import { requireUnAuth } from "@/lib/auth/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();

  return <div className="min-h-screen bg-background">{children}</div>;
}
