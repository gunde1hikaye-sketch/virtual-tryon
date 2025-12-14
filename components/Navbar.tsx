import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-semibold">
        Virtual Try-On
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <Link href="/login">Giriş</Link>
            <Link href="/register">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}
