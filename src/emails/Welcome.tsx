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
      <Layout
        previewText={`Welcome to ${appConfig.projectName}, ${userName}! 👋`}
      >
        <Text>
          Welcome to {appConfig.projectName}, {userName}! 👋
        </Text>

        <Text>We&apos;re excited to have you on board!</Text>

        <Container className="ml-4 mt-4">
          <Text className="mb-2">
            🚀 Here&apos;s what you can do with {appConfig.projectName}:
          </Text>
          <Text className="ml-4 mb-2">• Lorem ipsum dolor sit amet</Text>
          <Text className="ml-4 mb-2">• Lorem ipsum dolor sit amet</Text>
          <Text className="ml-4 mb-2">• Lorem ipsum dolor sit amet</Text>
          <Text className="ml-4 mb-2">• Lorem ipsum dolor sit amet</Text>
        </Container>

        <Text className="mt-4">Ready to get started?</Text>

        <Button
          href={dashboardUrl}
          className="bg-primary text-primary-foreground rounded-md py-2 px-4 mt-4"
        >
          Get Started
        </Button>

        <Text className="mt-4 text-muted">
          Need help getting started? Reply to this email and our support team
          will be happy to help!
        </Text>
      </Layout>
    </Html>
  );
}
