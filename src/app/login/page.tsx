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
        redirectTo: `${window.location.origin}/auth/callback`
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
        : supabase.auth.signUp({ email, password });

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
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md border border-border/60">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{t("auth.title")}</h1>
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
  );
}
