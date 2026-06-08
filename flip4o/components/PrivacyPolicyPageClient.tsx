"use client";

import { useRouter } from "next/navigation";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";

export function PrivacyPolicyPageClient() {
  const router = useRouter();

  return (
    <PrivacyPolicyModal
      open
      onClose={() => router.push("/")}
    />
  );
}
