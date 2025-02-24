"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/admin"); // Redirect to admin if logged in
      } else {
        router.replace("/sign-in"); // Redirect to sign-in if not logged in
      }
    };

    checkSession();
  }, [router, supabase]);

  return null;
}
