"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
    >
      Sair
    </button>
  );
}
