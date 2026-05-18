"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.email) {
      // Проверяем роль через API
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            router.push("/");
          }
        })
        .catch(() => router.push("/"))
        .finally(() => setChecking(false));
    }
  }, [session, status, router]);

  if (status === "loading" || checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещён</h1>
          <p className="text-gray-400 mb-4">У вас нет прав администратора</p>
          <button
            onClick={() => router.push("/")}
            className="text-pink-400 hover:text-pink-300"
          >
            ← Вернуться на сайт
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}