import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | %s",
    default: "Website",
  },
  description: "Website",
};

function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default WebsiteLayout;
