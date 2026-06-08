import type { Metadata } from "next";
import { PrivacyPolicyPageClient } from "@/components/PrivacyPolicyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | FLIP40.COM",
  description:
    "FLIP40.COM privacy policy — Privacy-by-Design. Your business ideas and evaluation data stay on your device.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyPageClient />;
}
