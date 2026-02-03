import { Suspense } from "react";
import InviteClient from "@/app/invite/InviteClient";

export default function InvitePage() {
  return (
    <Suspense fallback={null}>
      <InviteClient />
    </Suspense>
  );
}
