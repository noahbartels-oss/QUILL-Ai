import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PLAN_LIMITS } from "@/lib/anthropic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { usage: true },
  });

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const plan = user.plan as "TRIAL" | "STARTER" | "PRO" | "AGENCY";
  const limits = PLAN_LIMITS[plan];

  const usage = {
    generationsUsed: user.usage?.generationsUsed ?? 0,
    generationsMax: limits.generationsPerMonth,
    isLifetimeCap: limits.isLifetimeCap,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar plan={user.plan} usage={usage} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
