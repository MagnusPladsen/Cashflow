"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getSiteUrl } from "@/lib/supabase/url";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback`
      }
    });

    if (error) {
      toast.error(t("auth.errorTitle"), { description: error.message });
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    const supabase = createClient();
    const action =
      mode === "signIn"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${getSiteUrl()}/auth/callback` }
          });

    const { error } = await action;
    if (error) {
      toast.error(t("auth.errorTitle"), { description: error.message });
      setLoading(false);
      return;
    }

    if (mode === "signUp") {
      toast.success(t("auth.checkEmailTitle"), {
        description: t("auth.checkEmailDescription")
      });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.85)]">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Cashflow
            </p>
            <h1 className="mt-3 text-4xl font-semibold font-display">
              {t("auth.title")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          </div>
        </div>
        <Card className="w-full border border-border/60 bg-card/70">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
              </p>
              <p className="text-sm text-muted-foreground">{t("auth.subtitle")}</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full rounded-full"
                onClick={() => handleOAuth("google")}
                disabled={loading}
              >
                {t("auth.google")}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => handleOAuth("apple")}
                disabled={loading}
              >
                {t("auth.apple")}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full rounded-full"
                onClick={handleEmailAuth}
                disabled={loading || !email || !password}
              >
                {mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full"
                onClick={() =>
                  setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"))
                }
                disabled={loading}
              >
                {mode === "signIn" ? t("auth.createAccount") : t("auth.backToSignIn")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
