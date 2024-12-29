import * as React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Container } from "@react-email/container";
import Layout from "./components/Layout";
import { appConfig } from "@/lib/config";

interface WelcomeEmailProps {
  userName: string;
  dashboardUrl: string;
}

export default function Welcome({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Layout previewText={`Welcome to Gloow, ${userName}! 👋`}>
        <Text>
          Welcome to {appConfig.projectName}, {userName}! 👋
        </Text>

        <Text>We&apos;re excited to have you on board!</Text>

        <Container style={{ marginLeft: "24px", marginTop: "24px" }}>
          <Text style={{ margin: "8px 0" }}>
            🚀 Here&apos;s what you can do with {appConfig.projectName}:
          </Text>
          <Text style={{ margin: "8px 0", paddingLeft: "16px" }}>
            {/* TODO: Edit these lines */}
            • Create interactive links with CTAs
          </Text>
          <Text style={{ margin: "8px 0", paddingLeft: "16px" }}>
            • Track engagement and conversions
          </Text>
          <Text style={{ margin: "8px 0", paddingLeft: "16px" }}>
            • Customize your link appearance
          </Text>
          <Text style={{ margin: "8px 0", paddingLeft: "16px" }}>
            • Analyze performance metrics
          </Text>
        </Container>

        <Text style={{ marginTop: "24px" }}>
          {/* TODO: Edit this line */}
          Ready to create your first interactive link?
        </Text>

        <Button
          href={dashboardUrl}
          style={{
            background: "#f97316",
            color: "#fff",
            padding: "12px 20px",
            marginTop: "16px",
            borderRadius: "6px",
          }}
        >
          Get Started
        </Button>

        <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
          Need help getting started? Reply to this email and our support team
          will be happy to help!
        </Text>
      </Layout>
    </Html>
  );
}
