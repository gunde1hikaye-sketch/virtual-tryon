"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordOk = useMemo(() => PASSWORD_REGEX.test(password), [password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordOk) {
      return setError("Şifre en az 8 karakter olmalı ve en az 1 büyük + 1 küçük harf içermeli.");
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) return setError(error.message);

    // Eğer email confirmation açıksa kullanıcıya “mailine bak” mesajı göstermek isteyebilirsiniz.
    router.push("/");
    router.refresh();
  };

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Kayıt Ol</h1>
      <p className="text-sm text-muted-foreground mt-1">Yeni hesap oluşturun.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className={`text-xs ${password.length === 0 ? "text-muted-foreground" : passwordOk ? "text-green-600" : "text-red-600"}`}>
            Şifre: en az 8 karakter, en az 1 büyük harf, en az 1 küçük harf
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button className="w-full" disabled={loading}>
          {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Zaten hesabın var mı?{" "}
          <Link className="underline" href="/login">
            Giriş yap
          </Link>
        </p>
      </form>
    </div>
  );
}
