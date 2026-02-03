"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function InviteAcceptPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const accept = async () => {
      if (!token) return;
      setStatus("loading");
      const supabase = createClient();
      const { error, data } = await supabase.rpc("accept_invite_token", {
        token_value: token
      });
      if (error || !data) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    };

    accept();
  }, [token, router]);

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md border border-border/60">
        <CardContent className="space-y-4 p-8 text-center">
          <h1 className="text-2xl font-semibold">{t("invite.title")}</h1>
          {status === "idle" || status === "loading" ? (
            <p className="text-sm text-muted-foreground">{t("invite.loading")}</p>
          ) : status === "success" ? (
            <p className="text-sm text-muted-foreground">{t("invite.success")}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{t("invite.error")}</p>
          )}
          <Button onClick={() => router.push("/login")} className="rounded-full">
            {t("invite.goToLogin")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
