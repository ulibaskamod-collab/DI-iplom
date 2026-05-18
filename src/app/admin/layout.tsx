"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Используем as any для обхода ошибки TypeScript
    const userRole = (session?.user as any)?.role;
    
    if (status === "unauthenticated" || userRole !== "admin") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const userRole = (session?.user as any)?.role;
  if (userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
}