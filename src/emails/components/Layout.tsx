import { appConfig } from "@/lib/config";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface LayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000";

export const Layout = ({ children, previewText }: LayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText || ""}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#000000",
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <div className="flex justify-center">
              <Img
                src={`${baseUrl}/assets/images/icon.png`}
                width="20"
                height="20"
                alt={`${appConfig.projectName} Logo`}
                className="my-0 mx-0"
              />
            </div>
            {children}
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Img
              src={`${baseUrl}/assets/images/icon.png`}
              width="20"
              height="20"
              alt={`${appConfig.projectName} Logo`}
              className="my-0 mx-0"
            />
            <Text className="text-[#666666] text-[11px] leading-[24px]">
              This email was sent to you by {appConfig.projectName}.
              <br />
              Registered Office: {appConfig.legal.address.street},{" "}
              {appConfig.legal.address.city}, {appConfig.legal.address.state},{" "}
              {appConfig.legal.address.postalCode},{" "}
              {appConfig.legal.address.country}
              <br />
              If you have any questions, feel free to reach out to us at{" "}
              <Link
                className="text-primary-400"
                href={`mailto:${appConfig.legal.email}`}
              >
                {appConfig.legal.email}
              </Link>{" "}
              or{" "}
              <Link className="text-primary-400" href={`${baseUrl}/contact`}>
                Contact Us
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
