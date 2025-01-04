import * as React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import Layout from "./components/Layout";
import { appConfig } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";
interface MagicLinkEmailProps {
  url: string;
  expiresAt: Date;
}

export default function MagicLinkEmail({
  url,
  expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000),
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Layout previewText={`Sign in to ${appConfig.projectName} 🔐`}>
        <Text>Hello there! 👋</Text>

        <Text>
          Click the button below to continue to your {appConfig.projectName}{" "}
          account.
        </Text>

        <Button
          href={url}
          className="bg-primary text-primary-foreground rounded-md py-2 px-4 mt-4"
        >
          Continue to {appConfig.projectName}
        </Button>

        <Text className="text-muted text-[14px] mt-4">
          This login link will expire{" "}
          {formatDistanceToNow(new Date(expiresAt), { addSuffix: true })}. If
          you didn&apos;t request this email, you can safely ignore it.
        </Text>
      </Layout>
    </Html>
  );
}
