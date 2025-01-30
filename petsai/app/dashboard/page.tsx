"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser, UserProfile} from "@/lib/api";
import { useRouter } from "next/navigation"; // ✅ Import router for redirection

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Redirect if not authenticated

  useEffect(() => {
    async function checkAuth() {
      const fetchedUser = await fetchCurrentUser();
      if (!fetchedUser) {
        router.push("/login"); // ✅ Redirect to login if not authenticated
        return;
      }
      setUser(fetchedUser);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
